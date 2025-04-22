import { useState, useEffect, useRef } from 'react';
import "./styles/del.css"
// Example data - this would come from your backend
const userData = {
  name: "John Doe",
  totalSpent: 78500,
  topCategory: "Send Money",
  topReceiver: "Jane Smith",
  totalTransactions: 145,
  savings: 15000,
  categories: [
    { name: "Send Money", amount: 19200 },
    { name: "Bills", amount: 12500 },
    { name: "Shopping", amount: 8300 },
    { name: "Services", amount: 15000 }
  ]
};

export default function MPesaWrappedVideoPlayer() {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  
  // Scene definitions - timing and content for each scene
  const scenes = [
    {
      start: 0,
      end: 5, // seconds
      render: (ctx, time) => {
        // Intro scene
        const progress = (time % 5) / 5;
        
        // Background
        ctx.fillStyle = "#111111";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        // Animated text
        ctx.fillStyle = "#00c853";
        ctx.font = `${Math.min(ctx.canvas.width * 0.08, 70)}px Arial`;
        ctx.textAlign = "center";
        
        // Fade in effect
        const alpha = progress < 0.3 ? progress / 0.3 : 1;
        ctx.globalAlpha = alpha;
        
        // Scale effect
        const scale = 0.8 + (progress < 0.5 ? progress * 0.4 : 0.2);
        
        ctx.save();
        ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
        ctx.scale(scale, scale);
        ctx.fillText("Your M-Pesa Year", 0, 0);
        ctx.restore();
        
        // Reset alpha
        ctx.globalAlpha = 1;
        
        // Add personalized name with typewriter effect
        if (progress > 0.4) {
          const nameProgress = Math.min((progress - 0.4) / 0.3, 1);
          const nameChars = Math.floor(userData.name.length * nameProgress);
          const nameText = userData.name.substring(0, nameChars);
          
          ctx.fillStyle = "#ffffff";
          ctx.font = `${Math.min(ctx.canvas.width * 0.04, 35)}px Arial`;
          ctx.fillText(nameText, ctx.canvas.width / 2, ctx.canvas.height / 2 + 80);
        }
        
        // Particles
        if (progress > 0.2) {
          drawParticles(ctx, progress);
        }
      }
    },
    {
      start: 5,
      end: 10,
      render: (ctx, time) => {
        // Total spent scene
        const localTime = time - 5;
        const progress = localTime / 5;
        
        // Background
        ctx.fillStyle = "#111111";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        // Count-up animation
        const amount = Math.min(progress * 1.2, 1) * userData.totalSpent;
        
        ctx.fillStyle = "#ffffff";
        ctx.font = `${Math.min(ctx.canvas.width * 0.04, 35)}px Arial`;
        ctx.textAlign = "center";
        ctx.fillText("This year you spent", ctx.canvas.width / 2, ctx.canvas.height / 2 - 80);
        
        // Animated amount
        ctx.fillStyle = "#00c853";
        ctx.font = `bold ${Math.min(ctx.canvas.width * 0.08, 70)}px Arial`;
        ctx.fillText(`${Math.floor(amount).toLocaleString()} KSh`, ctx.canvas.width / 2, ctx.canvas.height / 2);
        
        // Show transactions count with fade-in
        if (progress > 0.7) {
          const subProgress = (progress - 0.7) / 0.3;
          ctx.globalAlpha = subProgress;
          ctx.fillStyle = "#ffffff";
          ctx.font = `${Math.min(ctx.canvas.width * 0.03, 28)}px Arial`;
          ctx.fillText(`Across ${userData.totalTransactions} transactions`, ctx.canvas.width / 2, ctx.canvas.height / 2 + 80);
          ctx.globalAlpha = 1;
        }
        
        // Flying KSh symbols
        drawFlyingSymbols(ctx, progress, "KSh");
      }
    },
    {
      start: 10,
      end: 15,
      render: (ctx, time) => {
        // Categories breakdown
        const localTime = time - 10;
        const progress = localTime / 5;
        
        // Background
        ctx.fillStyle = "#111111";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        ctx.fillStyle = "#ffffff";
        ctx.font = `${Math.min(ctx.canvas.width * 0.05, 40)}px Arial`;
        ctx.textAlign = "center";
        ctx.fillText("Your Top Categories", ctx.canvas.width / 2, 100);
        
        // Animated bar chart
        const barWidth = Math.min(ctx.canvas.width * 0.6, 500);
        const maxAmount = Math.max(...userData.categories.map(c => c.amount));
        const colors = ["#FF9800", "#4CAF50", "#2196F3", "#9C27B0"];
        
        userData.categories.forEach((category, i) => {
          const barHeight = 50;
          const spacing = 80;
          const y = ctx.canvas.height / 2 - 100 + (i * spacing);
          
          // Bar progress animation
          const barProgress = Math.min(progress * 1.5 - (i * 0.2), 1);
          if (barProgress <= 0) return;
          
          const barLength = (category.amount / maxAmount) * barWidth * barProgress;
          
          // Draw category name
          ctx.fillStyle = "#ffffff";
          ctx.font = `${Math.min(ctx.canvas.width * 0.03, 24)}px Arial`;
          ctx.textAlign = "right";
          ctx.fillText(category.name, ctx.canvas.width / 2 - 20, y + 15);
          
          // Draw bar
          ctx.fillStyle = colors[i % colors.length];
          ctx.fillRect(ctx.canvas.width / 2, y - barHeight/2, barLength, barHeight);
          
          // Draw amount
          if (barProgress > 0.8) {
            ctx.fillStyle = "#ffffff";
            ctx.font = `${Math.min(ctx.canvas.width * 0.025, 20)}px Arial`;
            ctx.textAlign = "left";
            ctx.fillText(`${category.amount.toLocaleString()} KSh`, 
              ctx.canvas.width / 2 + barLength + 10, 
              y + 5);
          }
        });
      }
    },
    {
      start: 15,
      end: 20,
      render: (ctx, time) => {
        // Final scene
        const localTime = time - 15;
        const progress = localTime / 5;
        
        // Background
        ctx.fillStyle = "#111111";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        // Thank you message with zoom effect
        const scale = 0.8 + (progress < 0.5 ? progress * 0.4 : 0.2);
        
        ctx.save();
        ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2 - 100);
        ctx.scale(scale, scale);
        
        ctx.fillStyle = "#00c853";
        ctx.font = `bold ${Math.min(ctx.canvas.width * 0.06, 50)}px Arial`;
        ctx.textAlign = "center";
        ctx.fillText("Thanks for using M-Pesa!", 0, 0);
        ctx.restore();
        
        // Show savings with count-up
        if (progress > 0.3) {
          const subProgress = Math.min((progress - 0.3) / 0.5, 1);
          const savingsAmount = Math.floor(subProgress * userData.savings);
          
          ctx.fillStyle = "#ffffff";
          ctx.font = `${Math.min(ctx.canvas.width * 0.03, 28)}px Arial`;
          ctx.textAlign = "center";
          ctx.fillText("You saved", ctx.canvas.width / 2, ctx.canvas.height / 2 + 20);
          
          ctx.fillStyle = "#FF9800";
          ctx.font = `bold ${Math.min(ctx.canvas.width * 0.05, 40)}px Arial`;
          ctx.fillText(`${savingsAmount.toLocaleString()} KSh`, ctx.canvas.width / 2, ctx.canvas.height / 2 + 80);
          
          // Show share button
          if (progress > 0.7) {
            drawButton(ctx, "Share My Wrapped", ctx.canvas.width / 2, ctx.canvas.height / 2 + 150);
          }
        }
        
        // Confetti effect
        if (progress > 0.5) {
          drawConfetti(ctx, progress);
        }
      }
    }
  ];
  
  // Helper function to draw particles
  function drawParticles(ctx, progress) {
    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
      // Use a deterministic "random" based on i for consistent animation
      const x = (Math.sin(i * 0.1) * 0.5 + 0.5) * ctx.canvas.width;
      const y = (Math.cos(i * 0.1) * 0.5 + 0.5) * ctx.canvas.height;
      const size = (Math.sin(i * 0.2 + progress * 5) * 0.5 + 0.5) * 5 + 2;
      
      ctx.fillStyle = `rgba(0, 200, 83, ${(Math.sin(i * 0.05 + progress * 3) * 0.5 + 0.5) * 0.7})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  // Helper function for flying symbols animation
  function drawFlyingSymbols(ctx, progress, symbol) {
    const symbolCount = 20;
    for (let i = 0; i < symbolCount; i++) {
      const angle = (i / symbolCount) * Math.PI * 2;
      const distance = progress * ctx.canvas.width * 0.7;
      const x = ctx.canvas.width / 2 + Math.cos(angle) * distance;
      const y = ctx.canvas.height / 2 + Math.sin(angle) * distance;
      const size = (Math.sin(i * 0.3 + progress * 5) * 0.5 + 0.5) * 20 + 10;
      
      ctx.fillStyle = `rgba(0, 200, 83, ${(1 - progress) * 0.7})`;
      ctx.font = `${size}px Arial`;
      ctx.textAlign = "center";
      ctx.fillText(symbol, x, y);
    }
  }
  
  // Helper function to draw confetti
  function drawConfetti(ctx, progress) {
    const confettiCount = 100;
    const colors = ["#FF9800", "#4CAF50", "#2196F3", "#9C27B0", "#F44336"];
    
    for (let i = 0; i < confettiCount; i++) {
      const x = (Math.sin(i * 0.1) * 0.5 + 0.5) * ctx.canvas.width;
      const yBase = -50 + (progress - 0.5) * 2 * ctx.canvas.height;
      const y = yBase + (i % 10) * 100;
      
      if (y < 0 || y > ctx.canvas.height) continue;
      
      const width = (Math.sin(i * 0.2) * 0.5 + 0.5) * 10 + 5;
      const height = (Math.cos(i * 0.2) * 0.5 + 0.5) * 10 + 5;
      const rotation = (progress * 5 + i * 0.1) % (Math.PI * 2);
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.fillStyle = colors[i % colors.length];
      ctx.fillRect(-width/2, -height/2, width, height);
      ctx.restore();
    }
  }
  
  // Helper function to draw a button
  function drawButton(ctx, text, x, y) {
    const buttonWidth = 200;
    const buttonHeight = 50;
    
    // Button background
    ctx.fillStyle = "#00c853";
    ctx.beginPath();
    // Use arc for browsers that don't support roundRect
    const radius = 25;
    ctx.moveTo(x - buttonWidth/2 + radius, y - buttonHeight/2);
    ctx.lineTo(x + buttonWidth/2 - radius, y - buttonHeight/2);
    ctx.arc(x + buttonWidth/2 - radius, y - buttonHeight/2 + radius, radius, -Math.PI/2, 0);
    ctx.lineTo(x + buttonWidth/2, y + buttonHeight/2 - radius);
    ctx.arc(x + buttonWidth/2 - radius, y + buttonHeight/2 - radius, radius, 0, Math.PI/2);
    ctx.lineTo(x - buttonWidth/2 + radius, y + buttonHeight/2);
    ctx.arc(x - buttonWidth/2 + radius, y + buttonHeight/2 - radius, radius, Math.PI/2, Math.PI);
    ctx.lineTo(x - buttonWidth/2, y - buttonHeight/2 + radius);
    ctx.arc(x - buttonWidth/2 + radius, y - buttonHeight/2 + radius, radius, Math.PI, 3*Math.PI/2);
    ctx.closePath();
    ctx.fill();
    
    // Button text
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 18px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, x, y);
  }
  
  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let startTime = null;
    
    // Set canvas size to fill parent
    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Animation function
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000; // Convert to seconds
      
      // Find current scene based on elapsed time
      let currentSceneIndex = 0;
      for (let i = 0; i < scenes.length; i++) {
        if (elapsed >= scenes[i].start && elapsed < scenes[i].end) {
          currentSceneIndex = i;
          break;
        } else if (elapsed >= scenes[i].end && i === scenes.length - 1) {
          // Loop back to first scene when finished
          startTime = timestamp - (scenes[0].start * 1000);
          currentSceneIndex = 0;
          break;
        }
      }
      
      setCurrentScene(currentSceneIndex);
      
      // Render the current scene
      scenes[currentSceneIndex].render(ctx, elapsed);
      
      // Continue animation if playing
      if (isPlaying) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    
    // Start animation
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate);
    }
    
    // Cleanup
    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isPlaying]);
  
  // Play/pause controls
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  return (
    <div className="relative w-full h-screen bg-gray-900">
      {/* Canvas for dynamic animation */}
      <canvas 
        ref={canvasRef} 
        className="absolute top-0 left-0 w-full h-full"
      />
      
      {/* Controls */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center">
        <button
          onClick={togglePlayPause}
          className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-colors"
        >
          {isPlaying ? "❚❚" : "▶"}
        </button>
        
        {/* Progress indicator */}
        <div className="absolute bottom-16 left-0 right-0 flex justify-center space-x-2">
          {scenes.map((_, index) => (
            <div 
              key={index}
              className={`w-2 h-2 rounded-full ${
                currentScene === index ? 'bg-green-500' : 'bg-gray-600'
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}