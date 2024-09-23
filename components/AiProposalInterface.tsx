'use client';

import React, { useState, useRef } from 'react';
import { Mic, Send, RefreshCw, Loader2, Camera, ArrowRight, ArrowLeft } from 'lucide-react';

const toneOptions = [
  { label: 'Plus formel', value: 'un peu plus formel' },
  { label: 'Plus informel', value: 'un peu moins formel' },
  { label: 'Enthousiaste', value: 'plus enthousiaste' },
];

const AiProposalInterface = () => {
  const [step, setStep] = useState('recording');
  const [recording, setRecording] = useState(false);
  const [proposal, setProposal] = useState('');
  const [formattedProposal, setFormattedProposal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photo, setPhoto] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const startRecording = async () => {
    console.log('Starting recording...');
    setRecording(true);
    audioChunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('Got audio stream');
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        console.log('Audio data available');
        audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = handleAudioStop;
      mediaRecorderRef.current.start();
      console.log('MediaRecorder started');
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setRecording(false);
    }
  };

  const stopRecording = () => {
    console.log('Stopping recording...');
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      console.log('MediaRecorder stopped');
    }
    setRecording(false);
    setIsLoading(true);
  };

  const handleAudioStop = async () => {
    console.log('Audio recording stopped');
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    console.log('Audio blob created, size:', audioBlob.size, 'bytes');
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');

    try {
      console.log('Sending audio for transcription...');
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      console.log('Transcription received:', data.text);
      setProposal(data.text);
      formatProposal(data.text);
    } catch (error) {
      console.error('Error transcribing audio:', error);
      setIsLoading(false);
    }
  };

  const formatProposal = async (text, tone = 'neutral') => {
    console.log('Formatting proposal...');
    console.log('Text to format:', text);
    console.log('Tone:', tone);
    try {
      const response = await fetch('/api/format', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, tone }),
      });
      const data = await response.json();
      console.log('Formatted proposal received:', data.text);
      setFormattedProposal(data.text);
      setProposal(data.text); // update proposal for manual editing
      setStep('editing');
    } catch (error) {
      console.error('Error formatting proposal:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const changeTone = (newTone) => {
    console.log('Changing tone to:', newTone);
    setIsLoading(true);
    formatProposal(proposal, newTone);
  };

  const submitProposal = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/submit-proposal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          photo,
          proposal: formattedProposal,
        }),
      });
      if (response.ok) {
        setStep('submitted');
        setTimeout(() => {
          setStep('recording');
          setName('');
          setEmail('');
          setPhoto(null);
          setProposal('');
          setFormattedProposal('');
        }, 15000);
      } else {
        throw new Error('Failed to submit proposal');
      }
    } catch (error) {
      console.error('Error submitting proposal:', error);
      // Handle error (e.g., show error message to user)
    } finally {
      setIsLoading(false);
    }
  };

  const restart = () => {
    setStep('recording');
    setName('');
    setEmail('');
    setPhoto(null);
    setProposal('');
    setFormattedProposal('');
  };

  const renderStep = () => {
    switch (step) {
      case 'recording':
        return (
          <div className="space-y-4">
            <button
              onClick={recording ? stopRecording : startRecording}
              className={`w-full py-6 text-xl font-poppins rounded-lg flex items-center justify-center transition-colors ${
                recording ? 'bg-[#f18a1b] text-white' : 'bg-[#25177d] hover:bg-[#1e1260] text-white'
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              ) : recording ? (
                <>
                  <Mic className="mr-2 h-6 w-6" /> Envoyer l'idée 
                </>
              ) : (
                <>
                  <Mic className="mr-2 h-6 w-6" /> Commencer l'enregistrement
                </>
              )}
            </button>
            <div className="flex justify-center">
              <button
                onClick={restart}
                className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-robotomono"
              >
                <RefreshCw className="h-6 w-6" />
              </button>
            </div>
          </div>
        );
      case 'editing':
        return (
          <div className="space-y-4">
            <textarea
              value={proposal}
              onChange={(e) => setProposal(e.target.value)}
              className="w-full p-2 border rounded font-robotomono"
              rows="4"
            />
            <div className="flex justify-between mb-4">
              {toneOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => changeTone(option.value)}
                  className="px-4 py-2 border border-[#25177d] rounded-lg hover:bg-[#25177d] hover:text-white transition-colors font-robotomono"
                  disabled={isLoading}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep('details')}
              className="w-full py-4 bg-[#25177d] text-white rounded-lg hover:bg-[#1e1260] transition-colors font-robotomono text-xl"
            >
              <ArrowRight className="inline mr-2 h-6 w-6" /> Continuer
            </button>
            <div className="flex justify-between">
              <button
                onClick={() => setStep('recording')}
                className="p-2 border border-[#25177d] text-[#25177d] rounded-lg hover:bg-[#25177d] hover:text-white transition-colors font-robotomono"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <button
                onClick={restart}
                className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-robotomono"
              >
                <RefreshCw className="h-6 w-6" />
              </button>
            </div>
          </div>
        );
      case 'details':
        return (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Votre nom"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded font-librebaskerville"
            />
            <input
              type="email"
              placeholder="Votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded font-librebaskerville"
            />
            <div className="flex items-center space-x-2">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="cursor-pointer flex items-center px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors font-poppins"
              >
                <Camera className="mr-2 h-4 w-4" /> Ajouter une photo (optionnel)
              </label>
              {photo && <img src={photo} alt="User" className="w-10 h-10 rounded-full object-cover" />}
            </div>
            <button
              onClick={() => setStep('finalReview')}
              className="w-full py-4 bg-[#25177d] text-white rounded-lg hover:bg-[#1e1260] transition-colors font-robotomono text-xl"
              disabled={!name || !email}
            >
              <ArrowRight className="inline mr-2 h-6 w-6" /> Continuer
            </button>
            <div className="flex justify-between">
              <button
                onClick={() => setStep('editing')}
                className="p-2 border border-[#25177d] text-[#25177d] rounded-lg hover:bg-[#25177d] hover:text-white transition-colors font-robotomono"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <button
                onClick={restart}
                className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-robotomono"
              >
                <RefreshCw className="h-6 w-6" />
              </button>
            </div>
          </div>
        );
      case 'finalReview':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold font-poppins">Vérifiez vos informations</h2>
            <p className="font-librebaskerville"><strong>Nom:</strong> {name}</p>
            <p className="font-librebaskerville"><strong>Email:</strong> {email}</p>
            {photo && <img src={photo} alt="User" className="w-20 h-20 rounded-full object-cover" />}
            <h3 className="font-bold font-poppins">Votre proposition:</h3>
            <textarea
              value={proposal}
              onChange={(e) => setProposal(e.target.value)}
              className="w-full p-2 border rounded font-robotomono"
              rows="4"
            />
            <button
              onClick={submitProposal}
              className="w-full py-4 bg-[#25177d] text-white rounded-lg hover:bg-[#1e1260] transition-colors font-robotomono text-xl"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="inline mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="inline mr-2 h-6 w-6" />
              )}
              Envoyer la proposition
            </button>
            <div className="flex justify-between">
              <button
                onClick={() => setStep('details')}
                className="p-2 border border-[#25177d] text-[#25177d] rounded-lg hover:bg-[#25177d] hover:text-white transition-colors font-robotomono"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <button
                onClick={restart}
                className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-robotomono"
              >
                <RefreshCw className="h-6 w-6" />
              </button>
            </div>
          </div>
        );
      case 'submitted':
        return (
          <div className="bg-white border-l-4 border-[#25177d] p-4 rounded-lg font-librebaskerville" role="alert">
            <p className="font-bold font-poppins">Youpi!</p>
            <p>Votre proposition a été envoyée.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f1f2f6] text-[#25177d] p-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-2 font-poppins">
          Proposez vos idées pour le budget participatif
        </h1>
        <p className="text-center mb-6 font-librebaskerville">
          Partagez votre idée pour la ville et contribuez à son avenir.
        </p>
        {renderStep()}
      </div>
    </div>
  );
};

export default AiProposalInterface;