import { useState, useEffect, useRef } from 'react';
import "./styles/del.css";

// Data from backend
const userData = {
  name: "John Doe",
  results_page: {
    essentials: {
      total_spent: 276120.0,
      total_received: 40000.0,
      net_flow: -236120.0,
      top_month: {
        month_name: "March",
        month_amount: 243598.0
      },
      categories: {
        "Pochi la Biashara": 4300.0,
        "send_money": 55234.0,
        "Till": 22106.0,
        "Pay_Bill": 142268.0
      }
    },
    top_spending_habits: {
      biggest_transactions: {
        biggest_amount: 54000.0,
        biggest_date: "2025-03-11",
        its_category: "Pay Bill"
      },
      most_frequent_recepient: {
        name: "NEWTON   KIPRONO",
        frequency: 30,
        amount: 26610.0
      },
      top_recepient: {
        name: "NEWTON   KIPRONO",
        amount: 26610.0
      },
      most_visited_paybill_or_till: {
        type: "Till Payment",
        name: "EDWIN LUSICHI",
        frequency: 10,
        amount: 1000.0
      }
    },
    time_based: {
      most_active_day: {
        date: "2025-03-24",
        number_of_transactions: 58,
        active_day_amount: 6820.0
      },
      inactive_days: {
        day_1: "2025-03-23",
        day_2: "2025-04-02",
        day_3: "2025-04-03",
        more_days_flag: "False"
      },
      peak_transaction_period: {
        period_name: "Afternoon",
        percentage: "38%"
      }
    }
  }
};

export default function ResultPage() {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  
  // Extended scene definitions with more visual variety
  const scenes = [
    {
      // Intro Scene with Particle Wave
      start: 0,
      end: 5,
      render: (ctx, time) => {
        const progress = (time % 5) / 5;
        
        // Gradient Background - dark purple to dark blue
        const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
        gradient.addColorStop(0, "#1a0033");
        gradient.addColorStop(1, "#00264d");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        // Particle wave effect
        drawParticleWave(ctx, progress);
        
        // Animated text with staggered appearance
        ctx.fillStyle = "#00c853";
        ctx.font = `bold ${Math.min(ctx.canvas.width * 0.08, 70)}px 'Segoe UI', Arial, sans-serif`;
        ctx.textAlign = "center";
        
        // Pulsing effect
        const scale = 0.95 + Math.sin(progress * Math.PI * 4) * 0.05;
        
        ctx.save();
        ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2 - 60);
        ctx.scale(scale, scale);
        ctx.fillText("Your M-Pesa Year", 0, 0);
        ctx.restore();
        
        // 2024 text with different appearance timing
        if (progress > 0.2) {
          const yearOpacity = Math.min((progress - 0.2) / 0.3, 1);
          ctx.globalAlpha = yearOpacity;
          ctx.fillStyle = "#ffb300";
          ctx.font = `bold ${Math.min(ctx.canvas.width * 0.06, 50)}px 'Segoe UI', Arial, sans-serif`;
          ctx.fillText("2024-2025", ctx.canvas.width / 2, ctx.canvas.height / 2 + 10);
          ctx.globalAlpha = 1;
        }
        
        // Add personalized name with typewriter effect
        if (progress > 0.4) {
          const nameProgress = Math.min((progress - 0.4) / 0.3, 1);
          const nameChars = Math.floor(userData.name.length * nameProgress);
          const nameText = userData.name.substring(0, nameChars);
          
          ctx.fillStyle = "#ffffff";
          ctx.font = `${Math.min(ctx.canvas.width * 0.04, 35)}px 'Segoe UI', Arial, sans-serif`;
          ctx.fillText(nameText, ctx.canvas.width / 2, ctx.canvas.height / 2 + 80);
        }
        
        // M-Pesa logo hint
        if (progress > 0.7) {
          const logoOpacity = Math.min((progress - 0.7) / 0.3, 1);
          ctx.globalAlpha = logoOpacity;
          
          // Draw stylized M-Pesa logo hint
          const logoX = ctx.canvas.width / 2;
          const logoY = ctx.canvas.height - 100;
          const logoSize = Math.min(ctx.canvas.width * 0.2, 120);
          
          ctx.fillStyle = "#00c853";
          ctx.beginPath();
          ctx.arc(logoX, logoY, logoSize / 2, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.fillStyle = "#ffffff";
          ctx.font = `bold ${logoSize * 0.4}px 'Segoe UI', Arial, sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("M", logoX, logoY);
          
          ctx.globalAlpha = 1;
        }
      }
    },
    {
      // Total Movement Scene with Flowing Graphics
      start: 5,
      end: 15,
      render: (ctx, time) => {
        const localTime = time - 8;
        const progress = localTime / 7;
        
        // Background with subtle gradient
        const gradient = ctx.createRadialGradient(
          ctx.canvas.width / 2, ctx.canvas.height / 2, 10,
          ctx.canvas.width / 2, ctx.canvas.height / 2, ctx.canvas.width * 0.8
        );
        gradient.addColorStop(0, "#0e1c36");
        gradient.addColorStop(1, "#081025");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        // Draw network-like background
        drawNetworkBackground(ctx, progress);
        
        // Section title with reveal animation
        const titleProgress = Math.min(progress * 3, 1);
        ctx.globalAlpha = titleProgress;
        ctx.fillStyle = "#ffffff";
        ctx.font = `bold ${Math.min(ctx.canvas.width * 0.05, 40)}px 'Segoe UI', Arial, sans-serif`;
        ctx.textAlign = "center";
        ctx.fillText("Money Movement Summary", ctx.canvas.width / 2, 80);
        ctx.globalAlpha = 1;
        
        // Show the financial stats with sequential reveal
        const statsStartTime = 0.15;
        const statsSpacing = 0.15;
        
        // Total Spent
        if (progress > statsStartTime) {
          const spentProgress = Math.min((progress - statsStartTime) / 0.3, 1);
          drawFinancialStat(
            ctx, 
            "Total Sent",
            userData.results_page.essentials.total_spent,
            ctx.canvas.width / 2 - 200,
            ctx.canvas.height / 2 - 60,
            spentProgress,
            "#ff5252"
          );
        }
        
        // Total Received
        if (progress > statsStartTime + statsSpacing) {
          const receivedProgress = Math.min((progress - (statsStartTime + statsSpacing)) / 0.3, 1);
          drawFinancialStat(
            ctx, 
            "Total Received",
            userData.results_page.essentials.total_received,
            ctx.canvas.width / 2 + 200,
            ctx.canvas.height / 2 - 60,
            receivedProgress,
            "#00c853"
          );
        }
        
        // Net Flow
        if (progress > statsStartTime + statsSpacing * 2) {
          const netProgress = Math.min((progress - (statsStartTime + statsSpacing * 2)) / 0.3, 1);
          drawFinancialStat(
            ctx, 
            "Net Flow",
            userData.results_page.essentials.net_flow,
            ctx.canvas.width / 2,
            ctx.canvas.height / 2 + 80,
            netProgress,
            userData.results_page.essentials.net_flow >= 0 ? "#00c853" : "#ff5252",
            true
          );
        }
        
        // Animation of money flow arrows
        if (progress > 0.6) {
          drawMoneyFlow(ctx, progress - 0.6);
        }
        
        // Top month callout
        if (progress > 0.75) {
          const topMonthProgress = Math.min((progress - 0.75) / 0.25, 1);
          ctx.globalAlpha = topMonthProgress;
          
          ctx.fillStyle = "#ffb300";
          ctx.font = `${Math.min(ctx.canvas.width * 0.03, 24)}px 'Segoe UI', Arial, sans-serif`;
          ctx.textAlign = "center";
          
          const topMonthText = `Your busiest month was ${userData.results_page.essentials.top_month.month_name} (${userData.results_page.essentials.top_month.month_amount.toLocaleString()} KSh)`;
          ctx.fillText(topMonthText, ctx.canvas.width / 2, ctx.canvas.height - 80);
          
          ctx.globalAlpha = 1;
        }
      }
    },
    {
      // Categories Breakdown with Donut Chart
      start: 12,
      end: 18,
      render: (ctx, time) => {
        const localTime = time - 12;
        const progress = localTime / 6;
        
        // Dark background
        ctx.fillStyle = "#0a0e17";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        // Draw subtle grid
        drawGrid(ctx, progress);
        
        // Title with shadow
        ctx.save();
        ctx.shadowColor = 'rgba(0, 200, 83, 0.5)';
        ctx.shadowBlur = 10;
        ctx.fillStyle = "#ffffff";
        ctx.font = `bold ${Math.min(ctx.canvas.width * 0.05, 42)}px 'Segoe UI', Arial, sans-serif`;
        ctx.textAlign = "center";
        ctx.fillText("Your Spending Categories", ctx.canvas.width / 2, 80);
        ctx.restore();
        
        // Draw animated donut chart
        const chartRadius = Math.min(ctx.canvas.width, ctx.canvas.height) * 0.25;
        const chartX = ctx.canvas.width / 2;
        const chartY = ctx.canvas.height / 2;
        
        // Calculate total for percentages
        const categories = userData.results_page.essentials.categories;
        const categoryNames = Object.keys(categories);
        const total = Object.values(categories).reduce((sum, val) => sum + val, 0);
        
        // Define colors
        const categoryColors = ["#FF9800", "#4CAF50", "#2196F3", "#9C27B0"];
        
        // Animation control: rotate the chart and reveal segments
        const rotationAngle = progress * Math.PI * 2;
        const revealProgress = Math.min(progress * 1.5, 1);
        
        // Draw donut segments
        let startAngle = -Math.PI / 2 + rotationAngle;
        categoryNames.forEach((category, index) => {
          const value = categories[category];
          const sliceAngle = (value / total) * Math.PI * 2 * revealProgress;
          
          // Draw segment
          ctx.beginPath();
          ctx.moveTo(chartX, chartY);
          ctx.arc(chartX, chartY, chartRadius, startAngle, startAngle + sliceAngle);
          ctx.closePath();
          ctx.fillStyle = categoryColors[index % categoryColors.length];
          ctx.fill();
          
          // Prepare for next segment
          startAngle += sliceAngle;
        });
        
        // Draw inner circle for donut hole with subtle gradient
        const innerRadius = chartRadius * 0.6;
        const centerGradient = ctx.createRadialGradient(
          chartX, chartY, innerRadius * 0.5,
          chartX, chartY, innerRadius
        );
        centerGradient.addColorStop(0, "#121824");
        centerGradient.addColorStop(1, "#0a0e17");
        
        ctx.beginPath();
        ctx.arc(chartX, chartY, innerRadius, 0, Math.PI * 2);
        ctx.fillStyle = centerGradient;
        ctx.fill();
        
        // Show total in the center
        if (progress > 0.3) {
          ctx.fillStyle = "#ffffff";
          ctx.font = `bold ${Math.min(ctx.canvas.width * 0.03, 28)}px 'Segoe UI', Arial, sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("Total Spent", chartX, chartY - 15);
          
          ctx.fillStyle = "#00c853";
          ctx.font = `bold ${Math.min(ctx.canvas.width * 0.035, 32)}px 'Segoe UI', Arial, sans-serif`;
          ctx.fillText(`${Math.floor(total).toLocaleString()} KSh`, chartX, chartY + 20);
        }
        
        // Show legend with category breakdown
        if (progress > 0.5) {
          const legendProgress = Math.min((progress - 0.5) / 0.5, 1);
          const legendX = ctx.canvas.width / 2;
          const legendY = chartY + chartRadius + 80;
          const legendWidth = Math.min(600, ctx.canvas.width * 0.8);
          const itemWidth = legendWidth / categoryNames.length;
          
          categoryNames.forEach((category, index) => {
            const itemProgress = Math.min((legendProgress - (index * 0.1)) * 2, 1);
            if (itemProgress <= 0) return;
            
            const x = legendX - (legendWidth / 2) + (itemWidth / 2) + (index * itemWidth);
            
            ctx.globalAlpha = itemProgress;
            
            // Color indicator
            ctx.fillStyle = categoryColors[index % categoryColors.length];
            ctx.beginPath();
            ctx.arc(x - itemWidth * 0.3, legendY - 10, 8, 0, Math.PI * 2);
            ctx.fill();
            
            // Category name (format nicely)
            const formattedCategory = category
              .replace(/_/g, ' ')
              .split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
              .join(' ');
            
            ctx.fillStyle = "#ffffff";
            ctx.font = `${Math.min(ctx.canvas.width * 0.025, 16)}px 'Segoe UI', Arial, sans-serif`;
            ctx.textAlign = "left";
            ctx.fillText(formattedCategory, x - itemWidth * 0.15, legendY - 10);
            
            // Amount and percentage
            const amount = categories[category];
            const percentage = Math.round((amount / total) * 100);
            
            ctx.fillStyle = "#bbbbbb";
            ctx.font = `${Math.min(ctx.canvas.width * 0.02, 14)}px 'Segoe UI', Arial, sans-serif`;
            ctx.fillText(`${Math.floor(amount).toLocaleString()} KSh (${percentage}%)`, x - itemWidth * 0.15, legendY + 10);
            
            ctx.globalAlpha = 1;
          });
        }
      }
    },
    {
      // Top Spending Habits with Animated Icons/Cards
      start: 18,
      end: 25,
      render: (ctx, time) => {
        const localTime = time - 18;
        const progress = localTime / 7;
        
        // Dark gradient background with subtle pattern
        const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
        gradient.addColorStop(0, "#131b2e");
        gradient.addColorStop(1, "#0c1021");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        // Add subtle pattern
        drawDotPattern(ctx, progress);
        
        // Section title
        ctx.fillStyle = "#ffffff";
        ctx.font = `bold ${Math.min(ctx.canvas.width * 0.05, 40)}px 'Segoe UI', Arial, sans-serif`;
        ctx.textAlign = "center";
        ctx.fillText("Your Spending Habits", ctx.canvas.width / 2, 80);
        
        // Animate in cards for different stats
        const cardStartTime = 0.1;
        const cardSpacing = 0.15;
        const cards = [
          {
            title: "Biggest Transaction",
            icon: (x, y, size) => drawIcon(ctx, "cash", x, y, size),
            value: `${userData.results_page.top_spending_habits.biggest_transactions.biggest_amount.toLocaleString()} KSh`,
            detail: `${userData.results_page.top_spending_habits.biggest_transactions.its_category} on ${formatDate(userData.results_page.top_spending_habits.biggest_transactions.biggest_date)}`
          },
          {
            title: "Most Frequent Recipient",
            icon: (x, y, size) => drawIcon(ctx, "person", x, y, size),
            value: userData.results_page.top_spending_habits.most_frequent_recepient.name,
            detail: `${userData.results_page.top_spending_habits.most_frequent_recepient.frequency} transactions (${userData.results_page.top_spending_habits.most_frequent_recepient.amount.toLocaleString()} KSh)`
          },
          {
            title: "Favorite Business",
            icon: (x, y, size) => drawIcon(ctx, "shop", x, y, size),
            value: userData.results_page.top_spending_habits.most_visited_paybill_or_till.name,
            detail: `${userData.results_page.top_spending_habits.most_visited_paybill_or_till.frequency} visits (${userData.results_page.top_spending_habits.most_visited_paybill_or_till.amount.toLocaleString()} KSh)`
          }
        ];
        
        // Draw cards in a grid or flow layout depending on canvas width
        const isNarrow = ctx.canvas.width < 768;
        const cardsPerRow = isNarrow ? 1 : 3;
        const cardWidth = Math.min(300, (ctx.canvas.width * 0.8) / cardsPerRow);
        const cardHeight = 160;
        const startY = isNarrow ? 140 : ctx.canvas.height / 2 - cardHeight / 2;
        
        cards.forEach((card, i) => {
          const row = Math.floor(i / cardsPerRow);
          const col = i % cardsPerRow;
          const cardProgress = Math.min((progress - (cardStartTime + i * cardSpacing)) / 0.3, 1);
          
          if (cardProgress <= 0) return;
          
          // Calculate position
          const x = isNarrow 
            ? ctx.canvas.width / 2
            : ctx.canvas.width / 2 + (col - 1) * (cardWidth + 20);
          const y = isNarrow
            ? startY + row * (cardHeight + 30)
            : startY;
          
          // Draw card with animation
          drawAnimatedCard(ctx, x, y, cardWidth, cardHeight, card, cardProgress);
        });
        
        // Add a fun fact at the bottom
        if (progress > 0.8) {
          const factProgress = Math.min((progress - 0.8) / 0.2, 1);
          ctx.globalAlpha = factProgress;
          
          ctx.fillStyle = "#ffb300";
          ctx.font = `italic ${Math.min(ctx.canvas.width * 0.025, 18)}px 'Segoe UI', Arial, sans-serif`;
          ctx.textAlign = "center";
          
          const funFact = `If you stacked all your transactions in KSh 1,000 notes, it would be ${Math.round(userData.results_page.essentials.total_spent / 1000 * 0.08)} cm tall!`;
          ctx.fillText(funFact, ctx.canvas.width / 2, ctx.canvas.height - 60);
          
          ctx.globalAlpha = 1;
        }
      }
    },
    {
      // Time Insights Scene with Clock Visualization
      start: 25,
      end: 32,
      render: (ctx, time) => {
        const localTime = time - 25;
        const progress = localTime / 7;
        
        // Night sky background
        const skyGradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
        skyGradient.addColorStop(0, "#0f2027");
        skyGradient.addColorStop(0.5, "#203a43");
        skyGradient.addColorStop(1, "#2c5364");
        ctx.fillStyle = skyGradient;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        // Add stars
        drawStars(ctx, progress);
        
        // Title with glow
        ctx.save();
        ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
        ctx.shadowBlur = 15;
        ctx.fillStyle = "#ffffff";
        ctx.font = `bold ${Math.min(ctx.canvas.width * 0.05, 40)}px 'Segoe UI', Arial, sans-serif`;
        ctx.textAlign = "center";
        ctx.fillText("Your Transaction Timing", ctx.canvas.width / 2, 80);
        ctx.restore();
        
        // Draw animated clock
        if (progress > 0.1) {
          const clockProgress = Math.min((progress - 0.1) / 0.4, 1);
          drawClockVisualization(ctx, clockProgress);
        }
        
        // Show most active day info
        if (progress > 0.4) {
          const activeInfoProgress = Math.min((progress - 0.4) / 0.3, 1);
          ctx.globalAlpha = activeInfoProgress;
          
          const infoX = ctx.canvas.width / 2;
          const infoY = ctx.canvas.height - 140;
          
          // Draw highlight box
          ctx.fillStyle = "rgba(0, 200, 83, 0.15)";
          ctx.strokeStyle = "#00c853";
          ctx.lineWidth = 2;
          roundRect(ctx, infoX - 200, infoY - 60, 400, 100, 10, true, true);
          
          // Content
          ctx.fillStyle = "#ffffff";
          ctx.font = `bold ${Math.min(ctx.canvas.width * 0.03, 22)}px 'Segoe UI', Arial, sans-serif`;
          ctx.textAlign = "center";
          ctx.fillText("Most Active Day", infoX, infoY - 30);
          
          ctx.fillStyle = "#00c853";
          ctx.font = `${Math.min(ctx.canvas.width * 0.035, 28)}px 'Segoe UI', Arial, sans-serif`;
          ctx.fillText(formatDate(userData.results_page.time_based.most_active_day.date), infoX, infoY + 5);
          
          ctx.fillStyle = "#bbbbbb";
          ctx.font = `${Math.min(ctx.canvas.width * 0.025, 18)}px 'Segoe UI', Arial, sans-serif`;
          const transText = `${userData.results_page.time_based.most_active_day.number_of_transactions} transactions • ${userData.results_page.time_based.most_active_day.active_day_amount.toLocaleString()} KSh`;
          ctx.fillText(transText, infoX, infoY + 35);
          
          ctx.globalAlpha = 1;
        }
        
        // Show peak transaction period
        if (progress > 0.7) {
          const peakProgress = Math.min((progress - 0.7) / 0.3, 1);
          ctx.globalAlpha = peakProgress;
          
          const peakX = ctx.canvas.width / 4;
          const peakY = ctx.canvas.height / 2 - 40;
          
          ctx.fillStyle = "#ffb300";
          ctx.font = `bold ${Math.min(ctx.canvas.width * 0.025, 20)}px 'Segoe UI', Arial, sans-serif`;
          ctx.textAlign = "center";
          ctx.fillText("Peak Transaction Time", peakX, peakY);
          
          ctx.fillStyle = "#ffffff";
          ctx.font = `${Math.min(ctx.canvas.width * 0.04, 32)}px 'Segoe UI', Arial, sans-serif`;
          ctx.fillText(userData.results_page.time_based.peak_transaction_period.period_name, peakX, peakY + 40);
          
          ctx.fillStyle = "#bbbbbb";
          ctx.font = `${Math.min(ctx.canvas.width * 0.03, 24)}px 'Segoe UI', Arial, sans-serif`;
          ctx.fillText(userData.results_page.time_based.peak_transaction_period.percentage, peakX, peakY + 75);
          
          ctx.globalAlpha = 1;
        }
        
        // Show inactive days info
        if (progress > 0.8) {
          const inactiveDayProgress = Math.min((progress - 0.8) / 0.2, 1);
          ctx.globalAlpha = inactiveDayProgress;
          
          const inactiveX = (ctx.canvas.width / 4) * 3;
          const inactiveY = ctx.canvas.height / 2 - 40;
          
          ctx.fillStyle = "#ff5252";
          ctx.font = `bold ${Math.min(ctx.canvas.width * 0.025, 20)}px 'Segoe UI', Arial, sans-serif`;
          ctx.textAlign = "center";
          ctx.fillText("Days With No Transactions", inactiveX, inactiveY);
          
          // List some inactive days
          const inactiveDays = [
            userData.results_page.time_based.inactive_days.day_1,
            userData.results_page.time_based.inactive_days.day_2,
            userData.results_page.time_based.inactive_days.day_3
          ];
          
          ctx.fillStyle = "#ffffff";
          ctx.font = `${Math.min(ctx.canvas.width * 0.025, 18)}px 'Segoe UI', Arial, sans-serif`;
          
          inactiveDays.forEach((day, i) => {
            ctx.fillText(formatDate(day), inactiveX, inactiveY + 30 + (i * 25));
          });
          
          // Show more indication
          if (userData.results_page.time_based.inactive_days.more_days_flag === "True") {
            ctx.fillStyle = "#bbbbbb";
            ctx.font = `italic ${Math.min(ctx.canvas.width * 0.02, 16)}px 'Segoe UI', Arial, sans-serif`;
            ctx.fillText("+ more days", inactiveX, inactiveY + 30 + (inactiveDays.length * 25));
          }
          
          ctx.globalAlpha = 1;
        }
      }
    },
    {
      // Final Summary Scene with Celebration
      start: 32,
      end: 39,
      render: (ctx, time) => {
        const localTime = time - 32;
        const progress = localTime / 7;
        
        // Celebration background with gradient
        const bgGradient = ctx.createRadialGradient(
          ctx.canvas.width / 2, ctx.canvas.height / 2, 10,
          ctx.canvas.width / 2, ctx.canvas.height / 2, ctx.canvas.width
        );
        bgGradient.addColorStop(0, "#002b36");
        bgGradient.addColorStop(1, "#001217");
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        // Draw celebrating confetti
        drawCelebrationConfetti(ctx, progress);
        
        // Thankyou message with animation
        ctx.save();
        ctx.shadowColor = 'rgba(0, 200, 83, 0.7)';
        ctx.shadowBlur = 20;
        
        const scale = 0.9 + Math.sin(progress * Math.PI * 2) * 0.1;
        ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 3);
        ctx.scale(scale, scale);
        
        ctx.fillStyle = "#00c853";
        ctx.font = `bold ${Math.min(ctx.canvas.width * 0.07, 60)}px 'Segoe UI', Arial, sans-serif`;
        ctx.textAlign = "center";
        ctx.fillText("Thanks for Using M-Pesa!", 0, 0);
        ctx.restore();
        
        // Summary stats with sequential appearance
        if (progress > 0.2) {
          const summaryProgress = Math.min((progress - 0.2) / 0.5, 1);
          
          const boxWidth = Math.min(600, ctx.canvas.width * 0.8);
          const boxHeight = 180;
          const boxX = ctx.canvas.width / 2 - boxWidth / 2;
          const boxY = ctx.canvas.height / 2 - boxHeight / 2 + 50;
          
          // Draw container with glow
          // Draw glowing container box
          ctx.save();
          ctx.shadowColor = 'rgba(0, 200, 83, 0.3)';
          ctx.shadowBlur = 15;
          ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
          ctx.strokeStyle = "rgba(0, 200, 83, 0.6)";
          ctx.lineWidth = 2;
          roundRect(ctx, boxX, boxY, boxWidth, boxHeight, 15, true, true);
          ctx.restore();
          
          // Draw year summary inside box
          const summaryItems = [
            { 
              label: "Total Transactions",
              value: `${userData.results_page.time_based.most_active_day.number_of_transactions * 5} transactions`, // Approximation for demo
              icon: "chart"
            },
            { 
              label: "Net Flow",
              value: `${Math.abs(userData.results_page.essentials.net_flow).toLocaleString()} KSh ${userData.results_page.essentials.net_flow >= 0 ? "Saved" : "Spent"}`, 
              icon: "money"
            },
            { 
              label: "Top Category",
              value: "Pay Bill", // Getting the highest category
              icon: "category"
            }
          ];
          
          summaryItems.forEach((item, i) => {
            const itemProgress = Math.min((summaryProgress - (i * 0.15)) * 3, 1);
            if (itemProgress <= 0) return;
            
            ctx.globalAlpha = itemProgress;
            
            const itemX = boxX + boxWidth / 2;
            const itemY = boxY + 45 + (i * 45);
            
            // Draw icon
            drawIcon(ctx, item.icon, itemX - 220, itemY, 20);
            
            // Draw label
            ctx.fillStyle = "#bbbbbb";
            ctx.font = `${Math.min(ctx.canvas.width * 0.022, 16)}px 'Segoe UI', Arial, sans-serif`;
            ctx.textAlign = "left";
            ctx.fillText(item.label, itemX - 190, itemY);
            
            // Draw value
            ctx.fillStyle = "#ffffff";
            ctx.font = `bold ${Math.min(ctx.canvas.width * 0.025, 20)}px 'Segoe UI', Arial, sans-serif`;
            ctx.fillText(item.value, itemX - 50, itemY);
            
            ctx.globalAlpha = 1;
          });
        }
        
        // Draw share button with pulsing animation
        if (progress > 0.65) {
          const buttonProgress = Math.min((progress - 0.65) / 0.35, 1);
          const buttonScale = 1 + Math.sin(progress * Math.PI * 4) * 0.05 * buttonProgress;
          
          ctx.save();
          ctx.globalAlpha = buttonProgress;
          ctx.translate(ctx.canvas.width / 2, ctx.canvas.height - 100);
          ctx.scale(buttonScale, buttonScale);
          
          // Glowing button
          ctx.shadowColor = 'rgba(0, 200, 83, 0.5)';
          ctx.shadowBlur = 10;
          ctx.fillStyle = "#00c853";
          roundRect(ctx, -100, -25, 200, 50, 25, true, false);
          
          // Button text
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 18px 'Segoe UI', Arial, sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("Share My Wrapped", 0, 0);
          
          ctx.restore();
        }
        
        // Final callout message
        if (progress > 0.8) {
          const finalMsgProgress = Math.min((progress - 0.8) / 0.2, 1);
          ctx.globalAlpha = finalMsgProgress;
          
          ctx.fillStyle = "#ffb300";
          ctx.font = `italic ${Math.min(ctx.canvas.width * 0.025, 18)}px 'Segoe UI', Arial, sans-serif`;
          ctx.textAlign = "center";
          ctx.fillText("See you next year for more insights!", ctx.canvas.width / 2, ctx.canvas.height - 40);
          
          ctx.globalAlpha = 1;
        }
      }
    }
  ];
  
  // Helper function to draw particle wave effect
  function drawParticleWave(ctx, progress) {
    const particleCount = 100;
    const amplitude = ctx.canvas.height * 0.2;
    const frequency = 2;
    
    for (let i = 0; i < particleCount; i++) {
      const x = (i / particleCount) * ctx.canvas.width;
      const wavePhase = progress * Math.PI * 2 * frequency;
      const y = ctx.canvas.height / 2 + Math.sin(x * 0.01 + wavePhase) * amplitude;
      
      const size = (Math.sin(i * 0.5 + progress * 7) * 0.5 + 0.5) * 6 + 1;
      const alpha = (Math.sin(i * 0.2 + progress * 5) * 0.5 + 0.5) * 0.7;
      
      // Gradient colors for particles
      const particleColor = i % 3 === 0 ? "#00c853" : (i % 3 === 1 ? "#64dd17" : "#aeea00");
      
      ctx.fillStyle = `rgba(${hexToRgb(particleColor)}, ${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  // Helper function to draw financial stat with animation
  function drawFinancialStat(ctx, label, amount, x, y, progress, color, isLarge = false) {
    if (progress <= 0) return;
    
    ctx.globalAlpha = progress;
    
    // Draw label
    ctx.fillStyle = "#ffffff";
    ctx.font = `${Math.min(ctx.canvas.width * 0.03, 24)}px 'Segoe UI', Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText(label, x, y);
    
    // Draw amount with count-up animation
    const displayAmount = Math.floor(amount * Math.min(progress * 1.5, 1));
    ctx.fillStyle = color;
    ctx.font = `bold ${isLarge ? 
      Math.min(ctx.canvas.width * 0.06, 48) : 
      Math.min(ctx.canvas.width * 0.045, 36)}px 'Segoe UI', Arial, sans-serif`;
    ctx.fillText(`${displayAmount.toLocaleString()} KSh`, x, y + 50);
    
    // Draw decorative circle behind it
    ctx.globalAlpha = progress * 0.15;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y + 20, 80, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.globalAlpha = 1;
  }
  
  // Helper function to draw money flow animation
  function drawMoneyFlow(ctx, progress) {
    if (progress <= 0) return;
    
    const flowProgress = Math.min(progress * 2, 1);
    const particleCount = 30;
    
    // Draw money particles flowing between stats
    for (let i = 0; i < particleCount; i++) {
      const particleProgress = (flowProgress + i / particleCount) % 1;
      
      // Flow from spend to net
      const startX = ctx.canvas.width / 2 - 200;
      const startY = ctx.canvas.height / 2 - 60;
      const endX = ctx.canvas.width / 2;
      const endY = ctx.canvas.height / 2 + 80;
      
      const x1 = startX + (endX - startX) * particleProgress;
      const y1 = startY + (endY - startY) * particleProgress;
      
      ctx.fillStyle = `rgba(255, 82, 82, ${(1 - particleProgress) * 0.8})`;
      ctx.beginPath();
      ctx.arc(x1, y1, 3, 0, Math.PI * 2);
      ctx.fill();
      
      // Flow from receive to net
      const startX2 = ctx.canvas.width / 2 + 200;
      const startY2 = ctx.canvas.height / 2 - 60;
      
      const x2 = startX2 + (endX - startX2) * particleProgress;
      const y2 = startY2 + (endY - startY2) * particleProgress;
      
      ctx.fillStyle = `rgba(0, 200, 83, ${(1 - particleProgress) * 0.8})`;
      ctx.beginPath();
      ctx.arc(x2, y2, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  // Helper function to draw network background
  function drawNetworkBackground(ctx, progress) {
    const nodeCount = 20;
    const nodes = [];
    
    // Create nodes at fixed positions
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.sin(i * 0.5) * (ctx.canvas.width * 0.4) + ctx.canvas.width / 2,
        y: Math.cos(i * 0.5) * (ctx.canvas.height * 0.4) + ctx.canvas.height / 2
      });
    }
    
    // Draw connections between nodes
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 200) {
          const alpha = (1 - distance / 200) * 0.2;
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
          
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }
    
    // Draw nodes
    nodes.forEach((node, i) => {
      const pulseScale = 1 + Math.sin(progress * Math.PI * 2 + i * 0.5) * 0.3;
      const radius = 3 * pulseScale;
      
      ctx.fillStyle = i % 3 === 0 ? "#00c853" : "#ffffff";
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      ctx.fill();
    });
  }
  
  // Helper function to draw subtle grid
  function drawGrid(ctx, progress) {
    const gridSize = 30;
    const gridOffset = progress * gridSize;
    
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    
    // Draw vertical lines
    for (let x = gridOffset % gridSize; x < ctx.canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, ctx.canvas.height);
      ctx.stroke();
    }
    
    // Draw horizontal lines
    for (let y = gridOffset % gridSize; y < ctx.canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(ctx.canvas.width, y);
      ctx.stroke();
    }
  }
  
  // Helper function to draw dots pattern
  function drawDotPattern(ctx, progress) {
    const spacing = 40;
    const offset = progress * spacing * 2;
    
    // Create dot pattern
    for (let x = offset % spacing; x < ctx.canvas.width; x += spacing) {
      for (let y = offset % spacing; y < ctx.canvas.height; y += spacing) {
        const size = 1.5;
        ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  
  // Helper function to draw animated card
  function drawAnimatedCard(ctx, x, y, width, height, card, progress) {
    // Entrance animation
    const entranceX = x + (1 - progress) * 100;
    const entranceY = y;
    const alpha = progress;
    const scale = 0.7 + progress * 0.3;
    
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(entranceX, entranceY);
    ctx.scale(scale, scale);
    
    // Card background with gradient
    const gradient = ctx.createLinearGradient(-width/2, -height/2, width/2, height/2);
    gradient.addColorStop(0, "rgba(30, 40, 70, 0.8)");
    gradient.addColorStop(1, "rgba(20, 30, 50, 0.8)");
    
    ctx.fillStyle = gradient;
    ctx.strokeStyle = "rgba(0, 200, 83, 0.4)";
    ctx.lineWidth = 2;
    roundRect(ctx, -width/2, -height/2, width, height, 10, true, true);
    
    // Card icon
    card.icon(-width/2 + 40, -height/2 + 40, 24);
    
    // Card title
    ctx.fillStyle = "#ffffff";
    ctx.font = `bold 18px 'Segoe UI', Arial, sans-serif`;
    ctx.textAlign = "left";
    ctx.fillText(card.title, -width/2 + 70, -height/2 + 45);
    
    // Card value with larger text
    ctx.fillStyle = "#00c853";
    ctx.font = `bold 22px 'Segoe UI', Arial, sans-serif`;
    ctx.fillText(card.value, -width/2 + 40, 10);
    
    // Card detail
    ctx.fillStyle = "#bbbbbb";
    ctx.font = `14px 'Segoe UI', Arial, sans-serif`;
    ctx.fillText(card.detail, -width/2 + 40, 40);
    
    ctx.restore();
  }
  
  // Helper function to draw various icons
  function drawIcon(ctx, iconType, x, y, size) {
    ctx.save();
    ctx.translate(x, y);
    
    switch (iconType) {
      case "cash":
        // Money icon
        ctx.fillStyle = "#00c853";
        ctx.strokeStyle = "#00c853";
        ctx.lineWidth = 2;
        
        // Bill shape
        ctx.strokeRect(-size/2, -size/2, size, size*0.6);
        ctx.fillRect(-size/2, -size/2, size, size*0.6);
        
        // Bill details
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(0, -size/5, size/10, 0, Math.PI * 2);
        ctx.fill();
        break;
        
      case "person":
        // Person icon
        ctx.fillStyle = "#2196F3";
        
        // Head
        ctx.beginPath();
        ctx.arc(0, -size/4, size/4, 0, Math.PI * 2);
        ctx.fill();
        
        // Body
        ctx.beginPath();
        ctx.moveTo(-size/3, size/4);
        ctx.lineTo(size/3, size/4);
        ctx.lineTo(size/5, -size/8);
        ctx.lineTo(-size/5, -size/8);
        ctx.closePath();
        ctx.fill();
        break;
        
      case "shop":
        // Shop icon
        ctx.fillStyle = "#FF9800";
        
        // Store shape
        ctx.beginPath();
        ctx.moveTo(-size/2, -size/3);
        ctx.lineTo(size/2, -size/3);
        ctx.lineTo(size/2, size/2);
        ctx.lineTo(-size/2, size/2);
        ctx.closePath();
        ctx.fill();
        
        // Store roof
        ctx.beginPath();
        ctx.moveTo(-size/2 - size/6, -size/3);
        ctx.lineTo(0, -size/2 - size/6);
        ctx.lineTo(size/2 + size/6, -size/3);
        ctx.closePath();
        ctx.fillStyle = "#FF6F00";
        ctx.fill();
        
        // Door
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(-size/6, -size/8, size/3, size*0.5);
        break;
        
      case "chart":
        // Chart icon
        ctx.strokeStyle = "#00c853";
        ctx.lineWidth = 2;
        
        // Frame
        ctx.strokeRect(-size/2, -size/2, size, size);
        
        // Bars
        ctx.fillStyle = "#00c853";
        ctx.fillRect(-size/3, 0, size/6, size/3);
        ctx.fillRect(-size/8, -size/4, size/6, size*0.6);
        ctx.fillRect(size/8, -size/8, size/6, size*0.4);
        break;
        
      case "money":
        // Money exchange icon
        ctx.fillStyle = "#ffb300";
        
        // Coin shape
        ctx.beginPath();
        ctx.arc(-size/4, 0, size/3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(-size/4, 0, size/5, 0, Math.PI * 2);
        ctx.fill();
        
        // Arrow
        ctx.fillStyle = "#00c853";
        drawArrow(ctx, -size/4 + size/10, 0, size/2, 0, size/6);
        break;
        
      case "category":
        // Category icon
        { const colors = ["#4CAF50", "#2196F3", "#FF9800"];
        const spacing = size / 4;
        
        // Draw 3 small squares in different colors
        colors.forEach((color, i) => {
          ctx.fillStyle = color;
          ctx.fillRect(-size/3 + (i * spacing), -size/3, size/5, size/5);
        });
        
        // Draw one large square
        ctx.fillStyle = "#9C27B0";
        ctx.fillRect(-size/3, -size/3 + spacing, size/2, size/3);
        break; }
    }
    
    ctx.restore();
  }
  
  // Helper function to draw arrow
  function drawArrow(ctx, fromX, fromY, toX, toY, headSize) {
    const angle = Math.atan2(toY - fromY, toX - fromX);
    
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
    
    // Arrow head
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(
      toX - headSize * Math.cos(angle - Math.PI / 6),
      toY - headSize * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      toX - headSize * Math.cos(angle + Math.PI / 6),
      toY - headSize * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fill();
  }
  
  // Helper function to draw stars
  function drawStars(ctx, progress) {
    const starCount = 100;
    
    for (let i = 0; i < starCount; i++) {
      const x = (Math.sin(i * 0.3) * 0.5 + 0.5) * ctx.canvas.width;
      const y = (Math.cos(i * 0.2) * 0.5 + 0.5) * ctx.canvas.height;
      const twinkle = Math.sin(progress * Math.PI * 2 + i * 0.2) * 0.5 + 0.5;
      const size = (i % 3 === 0) ? 1.5 : 1;
      
      ctx.fillStyle = `rgba(255, 255, 255, ${twinkle * 0.7})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  // Helper function to draw clock visualization
  function drawClockVisualization(ctx, progress) {
    const centerX = ctx.canvas.width / 4;
    const centerY = ctx.canvas.height / 2;
    const radius = Math.min(ctx.canvas.width, ctx.canvas.height) * 0.15;
    
    // Draw clock face
    ctx.save();
    ctx.shadowColor = 'rgba(0, 200, 83, 0.5)';
    ctx.shadowBlur = 10;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
    
    // Draw hour ticks
    for (let i = 0; i < 12; i++) {
      const angle = i * Math.PI / 6;
      const startX = centerX + (radius - 10) * Math.cos(angle);
      const startY = centerY + (radius - 10) * Math.sin(angle);
      const endX = centerX + radius * Math.cos(angle);
      const endY = centerY + radius * Math.sin(angle);
      
      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }
    
    // Draw peak time highlight (afternoon)
    const peakTimeStart = Math.PI;  // 12pm
    const peakTimeEnd = Math.PI * 1.5;  // 6pm (afternoon)
    
    ctx.fillStyle = "rgba(255, 179, 0, 0.15)";
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, peakTimeStart, peakTimeEnd);
    ctx.closePath();
    ctx.fill();
    
    // Highlight peak time text
    ctx.fillStyle = "#ffb300";
    ctx.font = `bold ${Math.min(ctx.canvas.width * 0.02, 16)}px 'Segoe UI', Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText("Peak Time", 
      centerX + Math.cos((peakTimeStart + peakTimeEnd) / 2) * (radius - 30),
      centerY + Math.sin((peakTimeStart + peakTimeEnd) / 2) * (radius - 30)
    );
    
    // Animated clock hands
    const handAngle = progress * Math.PI * 2;
    
    // Hour hand
    drawClockHand(ctx, centerX, centerY, radius * 0.5, handAngle, 6, "#ffffff");
    
    // Minute hand
    drawClockHand(ctx, centerX, centerY, radius * 0.7, handAngle * 12, 4, "#00c853");
    
    // Center dot
    ctx.fillStyle = "#ffb300";
    ctx.beginPath();
    ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
    ctx.fill();
    
    // Time periods labels
    const periods = ["Morning", "Afternoon", "Evening", "Night"];
    const periodColors = ["#64B5F6", "#FFB300", "#7986CB", "#4A148C"];
    
    periods.forEach((period, i) => {
      const angle = i * Math.PI / 2 + Math.PI / 4;
      const textX = centerX + (radius + 30) * Math.cos(angle);
      const textY = centerY + (radius + 30) * Math.sin(angle);
      
      // Show peak period differently
      const isPeak = period === userData.results_page.time_based.peak_transaction_period.period_name;
      
      ctx.fillStyle = isPeak ? "#ffb300" : periodColors[i];
      ctx.font = `${isPeak ? "bold " : ""}${Math.min(ctx.canvas.width * 0.025, 18)}px 'Segoe UI', Arial, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(period, textX, textY);
      
      // Show percentage for peak time
      if (isPeak) {
        ctx.font = `${Math.min(ctx.canvas.width * 0.02, 16)}px 'Segoe UI', Arial, sans-serif`;
        ctx.fillText(userData.results_page.time_based.peak_transaction_period.percentage, textX, textY + 25);
      }
    });
  }
  
  // Helper function to draw clock hand
  function drawClockHand(ctx, centerX, centerY, length, angle, width, color) {
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle);
    
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -length);
    ctx.stroke();
    
    ctx.restore();
  }
  
  // Helper function to draw celebration confetti
  function drawCelebrationConfetti(ctx, progress) {
    const confettiCount = 150;
    const colors = ["#FF9800", "#4CAF50", "#2196F3", "#9C27B0", "#F44336", "#00c853", "#FFEB3B"];
    
    for (let i = 0; i < confettiCount; i++) {
      // Determine if this is a rotating square or circle
      const isSquare = i % 3 === 0;
      
      // Calculate position
      const angle = (i / confettiCount) * Math.PI * 2;
      const radius = ctx.canvas.width * 0.4 * (0.3 + Math.random() * 0.7);
      const centerOffsetX = Math.sin(progress * 0.5) * ctx.canvas.width * 0.1;
      const centerOffsetY = Math.cos(progress * 0.5) * ctx.canvas.height * 0.1;
      
      const x = ctx.canvas.width / 2 + centerOffsetX + Math.cos(angle + progress) * radius;
      const y = ctx.canvas.height / 2 + centerOffsetY + Math.sin(angle + progress) * radius * 0.6;
      
      // Skip if offscreen
      if (x < 0 || x > ctx.canvas.width || y < 0 || y > ctx.canvas.height) continue;
      
      // Size and rotation
      const size = isSquare ? 
        (Math.sin(i * 0.2 + progress * 5) * 0.5 + 0.5) * 8 + 4 : 
        (Math.sin(i * 0.2 + progress * 5) * 0.5 + 0.5) * 6 + 3;
        
      const rotation = isSquare ? (progress * 5 + i * 0.1) % (Math.PI * 2) : 0;
      
      // Draw the confetti piece
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.fillStyle = colors[i % colors.length];
      
      if (isSquare) {
        ctx.fillRect(-size/2, -size/2, size, size);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.restore();
    }
  }
  
  // Helper function for rounded rectangles
  function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof radius === 'undefined') {
      radius = 5;
    }
    
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    
    if (fill) {
      ctx.fill();
    }
    if (stroke) {
      ctx.stroke();
    }
  }
  
  // Helper function to format date (YYYY-MM-DD to readable format)
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric'
    });
  }
  
// Helper function to convert hex to RGB
function hexToRgb(hex) {
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Parse the hex values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return `${r}, ${g}, ${b}`;
  }
  
  useEffect(() => {
    // Animation loop setup
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to match container
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };
    
    // Initial sizing
    resizeCanvas();
    
    // Resize listener
    window.addEventListener('resize', resizeCanvas);
    
    // Animation timestamps
    let startTime = Date.now();
    
    // Animation function
    const animate = () => {
      if (!isPlaying) return;
      
      // Calculate elapsed time in seconds
      const now = Date.now();
      const elapsedTime = (now - startTime) / 1000; 
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Find and render the current scene
      const currentScene = scenes.find(scene => 
        elapsedTime >= scene.start && elapsedTime < scene.end
      );
      
      if (currentScene) {
        currentScene.render(ctx, elapsedTime);
        setCurrentScene(scenes.indexOf(currentScene));
      } else if (elapsedTime >= scenes[scenes.length - 1].end) {
        // Loop back to beginning when complete
        startTime = Date.now() - (scenes[0].start * 1000);
      }
      
      // Continue animation loop
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    animationRef.current = requestAnimationFrame(animate);
    
    // Clean up
    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isPlaying]);
  
  // Function to handle scene navigation
  const navigateToScene = (sceneIndex) => {
    if (sceneIndex >= 0 && sceneIndex < scenes.length) {
      setCurrentScene(sceneIndex);
      // Update start time to jump to this scene
      // Cancel and restart animation
      cancelAnimationFrame(animationRef.current);
      animationRef.current = requestAnimationFrame();
    }
  };
  
  // Function to toggle play/pause
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  return (
    <div className="result-page">
      <div className="canvas-container">
        <canvas ref={canvasRef}></canvas>
        
        {/* Controls overlay */}
        <div className="controls">
          <button onClick={togglePlayPause}>
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          
          {/* Scene navigation dots */}
          <div className="scene-dots">
            {scenes.map((scene, index) => (
              <button 
                key={index}
                className={`scene-dot ${currentScene === index ? 'active' : ''}`}
                onClick={() => navigateToScene(index)}
              />
            ))}
          </div>
          
          {/* Share button */}
          <button className="share-button">
            Share My Wrapped
          </button>
        </div>
      </div>
    </div>
  );
}