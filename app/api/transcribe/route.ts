import { NextResponse } from 'next/server';
import openai from '@/lib/openai';

export async function POST(request: Request) {
  console.log('Transcription API called');
  const formData = await request.formData();
  const file = formData.get('audio') as File;

  if (!file) {
    console.log('No audio file provided');
    return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
  }

  console.log('Audio file received:', file.name, 'Size:', file.size, 'bytes');

  try {
    console.log('Sending audio to OpenAI Whisper for transcription');
    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: 'whisper-1',
    });

    console.log('Transcription received:', transcription.text);
    return NextResponse.json({ text: transcription.text });
  } catch (error) {
    console.error('Error transcribing audio:', error);
    return NextResponse.json({ error: 'Error transcribing audio' }, { status: 500 });
  }
}