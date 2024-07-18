"use client";

import axios from 'axios';
import React, { useState } from 'react';
import './globals.css';

const CombinedForm: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [summaryDownloadLink, setSummaryDownloadLink] = useState<string | null>(null);

  const handlePromptChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(event.target.value);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    try {
      if (prompt.trim() !== '') {
        const response = await axios.post('http://localhost:5000/api/prompt-post', {
          prompt: prompt,
        });
        setSummary(response.data);
        console.log(response.data);
        setPrompt('');
        setSummaryDownloadLink(null); 
      } else if (file) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post('http://localhost:5000/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        setSummary(response.data.summary);
        setFile(null);
        setSummaryDownloadLink(null); 
      }
    } catch (error) {
      console.error('Error submitting prompt or uploading file:', error);
    }
  };

  const generateDownloadLink = () => {
    const blob = new Blob([summary as string], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    setSummaryDownloadLink(url);
  };

  const handleDownload = () => {
    if (summary) {
      generateDownloadLink();
    }
  };

  return (
    <div className="root">
      <h1>AI-Powered Content Summarization and Analysis Tool</h1>
      {summary && (
        <div className="summaryContainer" style={{backgroundColor:"black",color:"white"}}>
          <h3 className="summaryHeader">Summary</h3>
          {summary.split('\n').map((item, index) => (
            <p key={index} className="summaryParagraph">{item}</p>
          ))}
          {summaryDownloadLink && (
            <a
              className="button"
              download="summary.txt"
              href={summaryDownloadLink}
              style={{ marginLeft: '10px' }}
            >
              Download Summary
            </a>
          )}
        </div>
      )}
      <textarea
        id="prompt-input"
        placeholder="Enter your prompt or upload a file"
        value={prompt}
        onChange={handlePromptChange}
        className="textInput"
      ></textarea>
      <div className="buttonContainer">
        <input
          accept=".txt,.html,.doc,.docx"
          className="fileInput"
          id="upload-file"
          type="file"
          onChange={handleFileChange}
        />
        <label htmlFor="upload-file" className="button">
          Upload File
        </label>
        <button onClick={handleSubmit} className="button">
          Submit
        </button>
        <button onClick={handleDownload} className="button">
          Download
        </button>
      </div>
    </div>
  );
};

export default CombinedForm;
