/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { motion } from 'motion/react';
import { Sparkles, Calendar, Info, GitCommit, Flame, Zap } from 'lucide-react';

interface HeatmapDataItem {
  date: Date;
  count: number;
}

export default function ContributionHeatmap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [data, setData] = useState<HeatmapDataItem[]>([]);
  const [totalContributions, setTotalContributions] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [activeDays, setActiveDays] = useState(0);
  const [hoveredDay, setHoveredDay] = useState<{
    date: Date;
    count: number;
    x: number;
    y: number;
  } | null>(null);

  // 1. Generate elegant mock activity data for the past 6 months
  useEffect(() => {
    const generatedData: HeatmapDataItem[] = [];
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6);

    // Set to start of Sunday of that week to align columns nicely
    const startSunday = d3.timeWeek.floor(startDate);
    const currentDate = new Date(startSunday);

    let total = 0;
    let currentStreak = 0;
    let longestStreak = 0;
    let activeCount = 0;

    while (currentDate <= endDate) {
      const day = currentDate.getDay();
      const isWeekend = day === 0 || day === 6;
      let count = 0;

      // Realistic pseudo-random distribution
      const rand = Math.random();
      if (!isWeekend) {
        if (rand < 0.15) {
          count = 0;
        } else if (rand < 0.5) {
          count = Math.floor(Math.random() * 3) + 1; // 1-3
        } else if (rand < 0.85) {
          count = Math.floor(Math.random() * 5) + 3; // 3-7
        } else {
          count = Math.floor(Math.random() * 6) + 8; // 8-13 (highly active day)
        }
      } else {
        if (rand < 0.7) {
          count = 0;
        } else if (rand < 0.93) {
          count = Math.floor(Math.random() * 2) + 1;
        } else {
          count = Math.floor(Math.random() * 4) + 2;
        }
      }

      generatedData.push({
        date: new Date(currentDate),
        count: count
      });

      total += count;
      if (count > 0) {
        activeCount++;
        currentStreak++;
        if (currentStreak > longestStreak) {
          longestStreak = currentStreak;
        }
      } else {
        currentStreak = 0;
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    setData(generatedData);
    setTotalContributions(total);
    setMaxStreak(longestStreak);
    setActiveDays(activeCount);
  }, []);

  // 2. Render D3 Heatmap grid
  useEffect(() => {
    if (!data.length || !svgRef.current || !containerRef.current) return;

    // Detect dark mode from html element
    const isDark = document.documentElement.classList.contains('dark');

    // Select SVG and clear existing contents
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Responsive sizing logic
    const containerWidth = containerRef.current.getBoundingClientRect().width;
    const isMobile = containerWidth < 640;

    // Grid size setup
    const cellSize = isMobile ? 9 : 11;
    const cellGap = isMobile ? 1.5 : 2;
    const labelOffsetLeft = isMobile ? 15 : 25;
    const labelOffsetTop = 15;

    // Find all Sundays at start of week
    const startSunday = d3.timeWeek.floor(data[0].date);
    const totalWeeks = d3.timeWeek.count(startSunday, data[data.length - 1].date) + 1;

    // Calculate dynamic size
    const width = labelOffsetLeft + totalWeeks * (cellSize + cellGap);
    const height = labelOffsetTop + 7 * (cellSize + cellGap);

    svg
      .attr('width', '100%')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('style', 'overflow: visible;');

    // Color thresholds based on theme
    const getColor = (count: number) => {
      if (count === 0) return isDark ? 'rgba(255, 239, 179, 0.05)' : 'rgba(1, 62, 55, 0.05)';
      if (count <= 2) return isDark ? '#143632' : '#C2E2DF';
      if (count <= 5) return isDark ? '#1C5B52' : '#81C7BE';
      if (count <= 8) return isDark ? '#2A9D8F' : '#40AB9E';
      return isDark ? '#FFEFB3' : '#013E37'; // High-intensity color matches theme headings
    };

    const g = svg.append('g');

    // Create month labels (Jan, Feb, etc.)
    const monthLabels: { [key: string]: number } = {};
    data.forEach((d) => {
      const monthStr = d.date.toLocaleDateString(undefined, { month: 'short' });
      const weekIndex = d3.timeWeek.count(startSunday, d.date);
      if (monthLabels[monthStr] === undefined) {
        monthLabels[monthStr] = weekIndex;
      }
    });

    Object.entries(monthLabels).forEach(([month, weekIndex]) => {
      g.append('text')
        .attr('x', labelOffsetLeft + weekIndex * (cellSize + cellGap))
        .attr('y', labelOffsetTop - 5)
        .attr('class', 'font-sans text-[8px] font-bold fill-primary/60 dark:fill-primary/50 uppercase tracking-wider')
        .text(month);
    });

    // Create day-of-week labels (Mon, Wed, Fri) on the left
    const daysLabel = isMobile ? ['M', 'W', 'F'] : ['Mon', 'Wed', 'Fri'];
    const daysIdx = [1, 3, 5]; // Indexes for Monday, Wednesday, Friday
    
    daysIdx.forEach((dayIdx, i) => {
      g.append('text')
        .attr('x', labelOffsetLeft - 6)
        .attr('y', labelOffsetTop + dayIdx * (cellSize + cellGap) + (cellSize / 2) + 2)
        .attr('text-anchor', 'end')
        .attr('class', 'font-sans text-[8px] font-medium fill-primary/50')
        .text(daysLabel[i]);
    });

    // Create contribution cells (rects)
    const cells = g.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('width', cellSize)
      .attr('height', cellSize)
      .attr('rx', 1.5)
      .attr('ry', 1.5)
      .attr('x', (d: any) => {
        const weekIndex = d3.timeWeek.count(startSunday, d.date);
        return labelOffsetLeft + weekIndex * (cellSize + cellGap);
      })
      .attr('y', (d: any) => {
        const dayOfWeek = d.date.getDay();
        return labelOffsetTop + dayOfWeek * (cellSize + cellGap);
      })
      .attr('fill', (d: any) => getColor(d.count))
      .attr('class', 'transition-all duration-300 cursor-pointer stroke-transparent hover:stroke-accent hover:stroke-[1.5px]')
      .style('transform-origin', (d: any) => {
        const weekIndex = d3.timeWeek.count(startSunday, d.date);
        const dayOfWeek = d.date.getDay();
        const cx = labelOffsetLeft + weekIndex * (cellSize + cellGap) + cellSize / 2;
        const cy = labelOffsetTop + dayOfWeek * (cellSize + cellGap) + cellSize / 2;
        return `${cx}px ${cy}px`;
      });

    // Animate cells in sequentially (staggered cascade)
    cells
      .style('opacity', 0)
      .style('transform', 'scale(0.3)')
      .transition()
      .duration(350)
      .delay((d: any, i) => Math.min(i * 1.5, 600)) // Cap the max delay so it doesn't take forever to render
      .style('opacity', 1)
      .style('transform', 'scale(1)');

    // Setup interactive hover behaviors
    cells
      .on('mouseenter', (event, d: any) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const containerRect = containerRef.current?.getBoundingClientRect();
        
        if (containerRect) {
          setHoveredDay({
            date: d.date,
            count: d.count,
            x: rect.left - containerRect.left + rect.width / 2,
            y: rect.top - containerRect.top - 42
          });
        }
      })
      .on('mouseleave', () => {
        setHoveredDay(null);
      });

  }, [data]);

  return (
    <div className="bg-card-bg border border-border-line rounded-2xl p-6 space-y-6 shadow-xs relative overflow-hidden group">
      
      {/* Dynamic Background Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent/2 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-500" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="p-1 rounded-md bg-accent-light text-accent">
              <Zap className="w-4 h-4" />
            </span>
            <h3 className="font-display font-extrabold text-base text-primary">
              Project Commits & Activity Heatmap
            </h3>
          </div>
          <p className="font-sans text-xs text-text-dark/60 leading-relaxed">
            D3-driven visualization logging incremental builds, feature pushes, and structural schema migrations.
          </p>
        </div>
        <div className="flex items-center space-x-1.5 self-start sm:self-center font-mono text-[9px] font-bold text-accent bg-accent/10 border border-accent/20 px-2.5 py-1 rounded-full uppercase">
          <Sparkles className="w-2.5 h-2.5 animate-spin-slow" />
          <span>D3 Engine Mounted</span>
        </div>
      </div>

      {/* Stats Summary Panel */}
      <div className="grid grid-cols-3 gap-3.5 border-t border-b border-border-line/60 py-4.5">
        <div className="space-y-1">
          <div className="flex items-center space-x-1.5 text-text-dark/50 dark:text-text-dark/60">
            <GitCommit className="w-3.5 h-3.5 text-accent" />
            <span className="font-sans text-[10px] font-bold uppercase tracking-wider">Updates</span>
          </div>
          <p className="font-display font-extrabold text-lg text-primary">{totalContributions}</p>
          <span className="block font-sans text-[9px] text-text-dark/40">Last 6 months</span>
        </div>
        <div className="space-y-1">
          <div className="flex items-center space-x-1.5 text-text-dark/50 dark:text-text-dark/60">
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            <span className="font-sans text-[10px] font-bold uppercase tracking-wider">Streak</span>
          </div>
          <p className="font-display font-extrabold text-lg text-primary">{maxStreak} days</p>
          <span className="block font-sans text-[9px] text-text-dark/40">Longest span</span>
        </div>
        <div className="space-y-1">
          <div className="flex items-center space-x-1.5 text-text-dark/50 dark:text-text-dark/60">
            <Calendar className="w-3.5 h-3.5 text-blue-500" />
            <span className="font-sans text-[10px] font-bold uppercase tracking-wider">Active</span>
          </div>
          <p className="font-display font-extrabold text-lg text-primary">
            {((activeDays / (data.length || 1)) * 100).toFixed(0)}%
          </p>
          <span className="block font-sans text-[9px] text-text-dark/40">{activeDays} / {data.length} days</span>
        </div>
      </div>

      {/* D3 Heatmap Canvas Container */}
      <div ref={containerRef} className="relative w-full pt-1.5">
        <svg ref={svgRef} className="w-full h-auto" />

        {/* Custom React Hover Tooltip */}
        {hoveredDay && (
          <div
            className="absolute pointer-events-none bg-primary dark:bg-card-bg text-bg-light dark:text-text-dark border border-border-line text-xs font-sans py-1.5 px-3 rounded-lg shadow-md z-50 flex flex-col space-y-0.5 transition-transform duration-75"
            style={{
              left: `${hoveredDay.x}px`,
              top: `${hoveredDay.y}px`,
              transform: 'translateX(-50%)',
            }}
          >
            <span className="font-bold whitespace-nowrap">
              {hoveredDay.count === 0 ? 'No updates' : `${hoveredDay.count} update${hoveredDay.count > 1 ? 's' : ''}`}
            </span>
            <span className="text-[10px] opacity-75 whitespace-nowrap">
              {hoveredDay.date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        )}
      </div>

      {/* Footer / Legend */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-[10px] font-sans text-text-dark/55 gap-2 border-t border-border-line/40 pt-4">
        <div className="flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-accent" />
          <span>Cells correspond to daily build actions and Git hooks.</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span>Less</span>
          <div className="flex space-x-1">
            <div className="w-2.5 h-2.5 rounded-[1px] bg-primary/[0.05]" />
            <div className="w-2.5 h-2.5 rounded-[1px] bg-[#C2E2DF] dark:bg-[#143632]" />
            <div className="w-2.5 h-2.5 rounded-[1px] bg-[#81C7BE] dark:bg-[#1C5B52]" />
            <div className="w-2.5 h-2.5 rounded-[1px] bg-[#40AB9E] dark:bg-[#2A9D8F]" />
            <div className="w-2.5 h-2.5 rounded-[1px] bg-[#013E37] dark:bg-[#FFEFB3]" />
          </div>
          <span>More</span>
        </div>
      </div>

    </div>
  );
}
