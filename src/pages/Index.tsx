
import React, { useState } from 'react';
import { TVLayout } from '../components/layout/TVLayout';
import { GameCarousel } from '../components/games/GameCarousel';
import { FeaturedGame } from '../components/games/FeaturedGame';

// Mock data
const featuredGame = {
  id: 'game1',
  title: 'Cyber Odyssey 2077',
  description: 'Embark on an epic adventure in a futuristic open world. Battle corporations, customize your character, and change the fate of the city.',
  image: 'https://via.placeholder.com/1200x500/0F172A/60A5FA?text=Cyber+Odyssey+2077',
  rating: 4.7,
  genres: ['RPG', 'Open World', 'Action'],
  creditCost: 20
};

const popularGames = [
  { id: 'game1', title: 'Cyber Odyssey 2077', image: 'https://via.placeholder.com/300x400/0F172A/60A5FA?text=Cyber+Odyssey', rating: 4.7 },
  { id: 'game2', title: 'Racing Champions', image: 'https://via.placeholder.com/300x400/0F172A/10B981?text=Racing+Champions', rating: 4.5 },
  { id: 'game3', title: 'Fantasy Quest IX', image: 'https://via.placeholder.com/300x400/0F172A/F97316?text=Fantasy+Quest', rating: 4.8 },
  { id: 'game4', title: 'Space Explorers', image: 'https://via.placeholder.com/300x400/0F172A/8B5CF6?text=Space+Explorers', rating: 4.2 },
  { id: 'game5', title: 'Zombie Survival', image: 'https://via.placeholder.com/300x400/0F172A/EC4899?text=Zombie+Survival', rating: 4.4 },
  { id: 'game6', title: 'Strategy Masters', image: 'https://via.placeholder.com/300x400/0F172A/EAB308?text=Strategy+Masters', rating: 4.6 },
];

const recentlyPlayed = [
  { id: 'game2', title: 'Racing Champions', image: 'https://via.placeholder.com/300x400/0F172A/10B981?text=Racing+Champions', rating: 4.5, lastPlayed: '2 hours ago' },
  { id: 'game3', title: 'Fantasy Quest IX', image: 'https://via.placeholder.com/300x400/0F172A/F97316?text=Fantasy+Quest', rating: 4.8, lastPlayed: '1 day ago' },
  { id: 'game5', title: 'Zombie Survival', image: 'https://via.placeholder.com/300x400/0F172A/EC4899?text=Zombie+Survival', rating: 4.4, lastPlayed: '3 days ago' },
];

const installed = [
  { id: 'game1', title: 'Cyber Odyssey 2077', image: 'https://via.placeholder.com/300x400/0F172A/60A5FA?text=Cyber+Odyssey', rating: 4.7 },
  { id: 'game2', title: 'Racing Champions', image: 'https://via.placeholder.com/300x400/0F172A/10B981?text=Racing+Champions', rating: 4.5 },
  { id: 'game4', title: 'Space Explorers', image: 'https://via.placeholder.com/300x400/0F172A/8B5CF6?text=Space+Explorers', rating: 4.2 },
];

export default function Index() {
  return (
    <TVLayout>
      <div className="h-full overflow-y-auto py-6 px-8 tv-scrollbar">
        <section className="mb-12">
          <FeaturedGame game={featuredGame} />
        </section>
        
        <section className="mb-10">
          <GameCarousel title="Recently Played" games={recentlyPlayed} showLastPlayed />
        </section>
        
        <section className="mb-10">
          <GameCarousel title="Most Popular" games={popularGames} />
        </section>
        
        <section className="mb-10">
          <GameCarousel title="Installed Games" games={installed} />
        </section>
      </div>
    </TVLayout>
  );
}
