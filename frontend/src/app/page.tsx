"use client"

import React from 'react';


import { Button, TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import axios from 'axios';
import { useState } from 'react';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '20px',
  },
  fileInput: {
    display: 'none',
  },
  buttonContainer: {
    marginTop: '10px',
    width: '100%',
    maxWidth: '900px',
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
  },
  summaryContainer: {
    marginTop: '20px',
    marginBottom: '20px',
    textAlign: 'left',
    border: '1px solid #ccc',
    padding: '10px',
    borderRadius: '5px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '900px',
  },
  summaryHeader: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  summaryParagraph: {
    marginBottom: '10px',
  },
});

const CombinedForm: React.FC = () => {
  const classes = useStyles();

  const [prompt, setPrompt] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [summaryDownloadLink, setSummaryDownloadLink] = useState<string | null>(null);

  const handlePromptChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
        const response = await axios.post('https://ai-generator-1.onrender.com/api/prompt-post', {
          prompt: prompt,
        });
        setSummary(response.data);
        setPrompt('');
        setSummaryDownloadLink(null); // Reset download link if new summary is generated
      } else if (file) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post('https://ai-generator-1.onrender.com/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        setSummary(response.data.summary);
        setFile(null);
        setSummaryDownloadLink(null); // Reset download link if new summary is generated
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
    <div className={classes.root}>
      <h1>AI-Powered Content Summarization and Analysis Tool</h1>
      {summary && (
        <div className={classes.summaryContainer}>
          <h3 className={classes.summaryHeader}>Summary</h3>
          {summary.split('\n').map((item, index) => (
            <p key={index} className={classes.summaryParagraph}>{item}</p>
          ))}
          {summaryDownloadLink && (
            <Button variant="contained" color="primary" download="summary.txt" href={summaryDownloadLink} style={{ marginLeft: '10px' }}>
              Download Summary
            </Button>
          )}
        </div>
      )}
      <TextField
        id="prompt-input"
        label="Enter your prompt or upload a file"
        variant="outlined"
        value={prompt}
        onChange={handlePromptChange}
        fullWidth
        multiline
        margin="normal"
        style={{ marginBottom: '10px', width: '50%' }}
      />
      <div className={classes.buttonContainer}>
        <input
          accept=".txt,.html,.doc,.docx"
          className={classes.fileInput}
          id="upload-file"
          type="file"
          onChange={handleFileChange}
        />
        <label htmlFor="upload-file">
          <Button variant="contained" component="span">
            Upload File
          </Button>
        </label>
        <Button variant="contained" onClick={handleSubmit}>
          Submit
        </Button>
        <Button variant="contained" onClick={handleDownload}>
          Download
        </Button>
      </div>
    </div>
  );
};

export default CombinedForm;
