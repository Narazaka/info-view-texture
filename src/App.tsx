import { useState, useRef } from 'react';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [text, setText] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleDraw = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Set background color
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw text
        ctx.fillStyle = '#333';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);
      }
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'image.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <>
      <div>
        <h1>Text to Image Generator</h1>
        <input
          type="text"
          placeholder="Enter your text here"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={handleDraw}>Draw Text</button>
        <button onClick={handleDownload}>Download Image</button>
      </div>
      <canvas ref={canvasRef} width={500} height={300} style={{ border: '1px solid #000' }}></canvas>
    </>
  );
}

export default App;
