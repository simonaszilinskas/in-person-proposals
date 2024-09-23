import { NextResponse } from 'next/server';
import openai from '@/lib/openai';

export async function POST(request: Request) {
  console.log('Format API called');
  const { text, tone } = await request.json();

  if (!text) {
    console.log('No text provided');
    return NextResponse.json({ error: 'No text provided' }, { status: 400 });
  }

  console.log('Received text for formatting:', text);
  console.log('Requested tone:', tone);

  try {
    console.log('Sending request to OpenAI GPT-3.5');
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          "role": "system",
          "content": `Vous allez recevoir une transcription d'une proposition pour le budget participatif de la ville. Votre tâche est de réecrire la proposition pour la rendre plus compréhensible pour les autres citoyens. Ne rajoute pas d'informations en plus de ce qui est mentionné dans la transcription. Vous devez le faire dans ce ton: ${tone}. Retournez uniquement la proposition et rien d'autre.`
        },
        {
          "role": "user",
          "content": text
        }
      ],
      temperature: 1,
      max_tokens: 2048,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    console.log('Response received from OpenAI');
    console.log('Formatted text:', response.choices[0].message.content);

    return NextResponse.json({ text: response.choices[0].message.content });
  } catch (error) {
    console.error('Error formatting text:', error);
    return NextResponse.json({ error: 'Error formatting text' }, { status: 500 });
  }
}