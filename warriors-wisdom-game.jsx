import React, { useState, useEffect } from 'react';
import { MapPin, Car, Search, FileText, Users, Award, ChevronRight, Play, Save, Menu, X, Map, Crosshair, Camera, Book, Shield, AlertTriangle } from 'lucide-react';

export default function WarriorsWisdomGame() {
  const [gameState, setGameState] = useState({
    currentLevel: 1,
    unlockedLevels: 1,
    evidence: [],
    completedLevels: [],
    currentScene: 'menu',
    playerChoices: [],
    gameProgress: 0,
    currentLocation: null,
    driving: false,
    drivingScore: 0,
    forensicsComplete: [],
    suspectProfiles: {},
    endings: [],
    playTime: 0
  });

  const [activeTab, setActiveTab] = useState('investigation');
  const [showMenu, setShowMenu] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [currentDialogue, setCurrentDialogue] = useState(null);
  const [drivingGame, setDrivingGame] = useState(null);
  const [forensicsPuzzle, setForensicsPuzzle] = useState(null);

  // Game data structures
  const levels = {
    1: {
      title: "The Initial Report",
      subtitle: "Nairobi",
      difficulty: "Beginner",
      cities: ["Nairobi"],
      locations: [
        { id: "museum", name: "Nairobi National Museum", icon: "🏛️" },
        { id: "market", name: "City Center Maasai Market", icon: "🏪" },
        { id: "vehicle", name: "Investigation Vehicle", icon: "🚗" }
      ],
      objectives: [
        "Confirm the stolen carving is a forgery",
        "Trace materials to Mombasa",
        "Analyze wood samples and beads",
        "Navigate to the market"
      ],
      twist: "Tire tracks match a government-issued SUV",
      unlocks: "Level 2 + Nairobi industrial roads"
    },
    2: {
      title: "Digging Into Motives",
      subtitle: "Nairobi + Mombasa",
      difficulty: "Intermediate I",
      cities: ["Nairobi", "Mombasa"],
      locations: [
        { id: "security_hub", name: "Security Hub", icon: "🔒" },
        { id: "curator_office", name: "Curator's Office", icon: "📋" },
        { id: "port", name: "Port Warehouse", icon: "⚓" },
        { id: "old_town", name: "Old Town Craft Shop", icon: "🏺" }
      ],
      objectives: [
        "Expose suspect ties to coastal cartels",
        "Analyze port shipping documents",
        "Complete high-speed chase sequence",
        "Find the festival photo link"
      ],
      twist: "Mombasa Governor has cartel stakes",
      unlocks: "Level 3 + Kisumu-Turkana routes"
    },
    3: {
      title: "Following the Trail",
      subtitle: "Nairobi + Kisumu",
      difficulty: "Intermediate II",
      cities: ["Nairobi", "Kisumu"],
      locations: [
        { id: "kipkorir_shop", name: "Kipkorir's Shop", icon: "🔨" },
        { id: "industrial", name: "Industrial Woodworks", icon: "🏭" },
        { id: "ferry", name: "Lake Victoria Terminal", icon: "⛴️" },
        { id: "luo_foundation", name: "Luo Cultural Foundation", icon: "📜" }
      ],
      objectives: [
        "Locate the real carving",
        "Trace the hidden sapphire to Turkana",
        "Navigate corrupt checkpoints",
        "Match tire tracks to cartel truck"
      ],
      twist: "Cabinet Secretary for Mining approved illegal permits",
      unlocks: "Level 4 + Eldoret processing plant"
    },
    4: {
      title: "Uncovering the Ring",
      subtitle: "Mombasa + Turkana",
      difficulty: "Advanced I",
      cities: ["Mombasa", "Turkana"],
      locations: [
        { id: "diplomatic", name: "Diplomatic Compound", icon: "🏢" },
        { id: "customs", name: "Port Customs Office", icon: "📦" },
        { id: "mining_site", name: "Desert Mining Site", icon: "⛏️" },
        { id: "turkana_center", name: "Turkana Cultural Center", icon: "🏛️" }
      ],
      objectives: [
        "Identify cartel's regional leader",
        "Expose government-mining ties",
        "Navigate desert terrain",
        "Avoid cartel patrols"
      ],
      twist: "The 'dead' suspect is alive - a coerced Turkana elder's son",
      unlocks: "Level 5 + Garissa transit hub"
    },
    5: {
      title: "Political Entanglements",
      subtitle: "All Four Cities",
      difficulty: "Advanced II",
      cities: ["Nairobi", "Mombasa", "Kisumu", "Turkana"],
      locations: [
        { id: "state_house", name: "State House Annex", icon: "🏰" },
        { id: "residence", name: "Politician's Residence", icon: "🏠" },
        { id: "airport", name: "Wilson Airport", icon: "✈️" },
        { id: "highways", name: "Intercity Highways", icon: "🛣️" }
      ],
      objectives: [
        "Expose full chain of command",
        "Link officials to international cartels",
        "Intercept diplomatic flight",
        "Trace laundered cartel money"
      ],
      twist: "Deputy President's Chief of Staff launders money through real estate",
      unlocks: "Level 6 + Cross-border routes"
    },
    6: {
      title: "The Final Resolution",
      subtitle: "All Regions + Beyond",
      difficulty: "Expert",
      cities: ["Nairobi", "Mombasa", "Kisumu", "Turkana", "Eldoret", "Garissa"],
      locations: [
        { id: "cartel_hq", name: "Cartel HQ", icon: "🏴" },
        { id: "transit_point", name: "International Transit", icon: "🌍" },
        { id: "all_previous", name: "All Previous Locations", icon: "📍" }
      ],
      objectives: [
        "Stop the 5-artifact heist",
        "Recover 'The Warrior's Wisdom'",
        "Coordinate multi-vehicle intercepts",
        "Secure justice and repatriation"
      ],
      twist: "Curator Muthoni has been working with anti-corruption agents for 2 years",
      unlocks: "Multiple Endings + Future Updates"
    }
  };

  const characters = {
    muthoni: {
      name: "Muthoni Kamau",
      role: "Museum Curator",
      city: "Nairobi",
      publicIdentity: "Nairobi National Museum Curator",
      hiddenTruth: "Forger hired under threat; secretly working with anti-corruption agents",
      threat: "High",
      color: "#e67e22"
    },
    raj: {
      name: "Raj Patel",
      role: "Art Dealer",
      city: "Nairobi",
      publicIdentity: "Private Art Dealer",
      hiddenTruth: "Undercover Interpol agent investigating the cartel",
      threat: "Ally",
      color: "#3498db"
    },
    kipkorir: {
      name: "Kipkorir Cheboi",
      role: "Head of Security",
      city: "Nairobi",
      publicIdentity: "Museum Head of Security",
      hiddenTruth: "Runs community group recovering stolen artifacts; holds the real carving",
      threat: "Medium",
      color: "#2ecc71"
    },
    amara: {
      name: "Amara Okonkwo",
      role: "Exhibit Installer",
      city: "Nairobi",
      publicIdentity: "Temporary Exhibit Installer",
      hiddenTruth: "Isaac Thuo's daughter; helped create forgery to protect the artifact",
      threat: "Low",
      color: "#9b59b6"
    },
    isaac: {
      name: "Isaac Thuo",
      role: "Custodian",
      city: "Kisumu",
      publicIdentity: "Claimed Carving Custodian/Descendant",
      hiddenTruth: "Imposter who stole the real piece for village medical funds; tricked by cartel",
      threat: "Medium",
      color: "#e74c3c"
    },
    njoroge: {
      name: "Mwangi Njoroge",
      role: "Cabinet Secretary",
      city: "Nairobi",
      publicIdentity: "Cabinet Secretary for Culture",
      hiddenTruth: "Uses scam money for gubernatorial campaign; ties to Mombasa shipping",
      threat: "Critical",
      color: "#c0392b"
    },
    fatuma: {
      name: "Fatuma Swaleh",
      role: "Governor",
      city: "Mombasa",
      publicIdentity: "Mombasa Governor",
      hiddenTruth: "Owns stake in cartel shipping; funds luxury projects",
      threat: "Critical",
      color: "#d35400"
    },
    kibet: {
      name: "John Kibet",
      role: "Cabinet Secretary",
      city: "Nairobi",
      publicIdentity: "Cabinet Secretary for Mining",
      hiddenTruth: "Approved illegal permits; pays gambling debts",
      threat: "Critical",
      color: "#8e44ad"
    },
    barnett: {
      name: "Barnett Mwenda",
      role: "Chief of Staff",
      city: "Nairobi",
      publicIdentity: "Deputy President's Chief of Staff",
      hiddenTruth: "Launders cartel money; funds presidential campaign",
      threat: "Critical",
      color: "#2c3e50"
    },
    ghost: {
      name: "David Kamau (The Ghost)",
      role: "Regional Boss",
      city: "Unknown",
      publicIdentity: "Unknown",
      hiddenTruth: "Former museum security head; links to international syndicates",
      threat: "Extreme",
      color: "#34495e"
    }
  };

  // Save game to persistent storage
  const saveGame = async () => {
    try {
      await window.storage.set('warriors_wisdom_save', JSON.stringify(gameState), false);
      alert('Game saved successfully!');
    } catch (error) {
      console.error('Failed to save game:', error);
      alert('Failed to save game. Please try again.');
    }
  };

  // Load game from persistent storage
  const loadGame = async () => {
    try {
      const saved = await window.storage.get('warriors_wisdom_save', false);
      if (saved && saved.value) {
        setGameState(JSON.parse(saved.value));
        setCurrentScene('investigation');
        alert('Game loaded successfully!');
      } else {
        alert('No saved game found.');
      }
    } catch (error) {
      console.error('Failed to load game:', error);
      alert('No saved game found.');
    }
  };

  // Start a new level
  const startLevel = (levelNum) => {
    setGameState(prev => ({
      ...prev,
      currentLevel: levelNum,
      currentScene: 'investigation',
      currentLocation: levels[levelNum].locations[0].id
    }));
    setShowMenu(false);
  };

  // Complete a level
  const completeLevel = (levelNum) => {
    setGameState(prev => ({
      ...prev,
      completedLevels: [...prev.completedLevels, levelNum],
      unlockedLevels: Math.max(prev.unlockedLevels, levelNum + 1),
      gameProgress: (prev.completedLevels.length + 1) / 6 * 100
    }));
  };

  // Add evidence
  const collectEvidence = (evidence) => {
    setGameState(prev => ({
      ...prev,
      evidence: [...prev.evidence, { ...evidence, timestamp: Date.now() }]
    }));
  };

  // Driving mini-game component
  const DrivingSequence = ({ level, onComplete }) => {
    const [position, setPosition] = useState(50);
    const [obstacles, setObstacles] = useState([]);
    const [score, setScore] = useState(0);
    const [time, setTime] = useState(30);

    useEffect(() => {
      const interval = setInterval(() => {
        setTime(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            onComplete(score);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      const obstacleInterval = setInterval(() => {
        setObstacles(prev => [...prev, { id: Date.now(), position: Math.random() * 80 + 10 }]);
      }, 2000);

      return () => {
        clearInterval(interval);
        clearInterval(obstacleInterval);
      };
    }, []);

    const handleMove = (direction) => {
      setPosition(prev => {
        const newPos = direction === 'left' ? Math.max(10, prev - 15) : Math.min(90, prev + 15);
        
        // Check collisions
        obstacles.forEach(obs => {
          if (Math.abs(obs.position - newPos) < 10) {
            setScore(s => Math.max(0, s - 10));
          }
        });
        
        return newPos;
      });
      setScore(s => s + 5);
    };

    return (
      <div className="driving-game">
        <div className="driving-hud">
          <div className="stat">⏱️ {time}s</div>
          <div className="stat">⭐ {score}</div>
        </div>
        
        <div className="road">
          {obstacles.map(obs => (
            <div key={obs.id} className="obstacle" style={{ left: `${obs.position}%` }}>🚧</div>
          ))}
          <div className="player-car" style={{ left: `${position}%` }}>🚗</div>
        </div>

        <div className="driving-controls">
          <button onClick={() => handleMove('left')} className="control-btn">← LEFT</button>
          <button onClick={() => handleMove('right')} className="control-btn">RIGHT →</button>
        </div>
      </div>
    );
  };

  // Forensics mini-game
  const ForensicsAnalysis = ({ type, onComplete }) => {
    const [selected, setSelected] = useState([]);
    const [samples] = useState([
      { id: 1, type: 'Kamba Wood', match: true, desc: 'Indigenous hardwood, dark grain' },
      { id: 2, type: 'Tanzanian Wood', match: false, desc: 'Imported softwood, light color' },
      { id: 3, type: 'Maasai Beads', match: true, desc: 'Traditional red/blue pattern' },
      { id: 4, type: 'Factory Beads', match: false, desc: 'Mass-produced, uniform' }
    ]);

    const checkAnalysis = () => {
      const correct = selected.every(id => samples.find(s => s.id === id)?.match);
      const complete = selected.length === samples.filter(s => s.match).length;
      
      if (correct && complete) {
        collectEvidence({
          type: 'forensics',
          title: 'Forgery Confirmed',
          description: 'Materials do not match authentic Kamba craftsmanship',
          level: gameState.currentLevel
        });
        onComplete(true);
      } else {
        alert('Analysis incomplete or incorrect. Review the samples.');
      }
    };

    return (
      <div className="forensics-panel">
        <h3>🔬 Forensic Analysis</h3>
        <p>Select all materials that match authentic "Warrior's Wisdom":</p>
        
        <div className="samples-grid">
          {samples.map(sample => (
            <div
              key={sample.id}
              className={`sample ${selected.includes(sample.id) ? 'selected' : ''}`}
              onClick={() => setSelected(prev =>
                prev.includes(sample.id)
                  ? prev.filter(id => id !== sample.id)
                  : [...prev, sample.id]
              )}
            >
              <div className="sample-name">{sample.type}</div>
              <div className="sample-desc">{sample.desc}</div>
            </div>
          ))}
        </div>

        <button onClick={checkAnalysis} className="analyze-btn">
          Complete Analysis
        </button>
      </div>
    );
  };

  // Main game render
  return (
    <div className="game-container">
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Manrope:wght@400;500;600;700&display=swap');

        .game-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
          color: #e8e8e8;
          font-family: 'Manrope', sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        .game-container::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 50%, rgba(212, 106, 56, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(0, 168, 150, 0.08) 0%, transparent 50%),
            url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
        }

        .header {
          background: rgba(10, 10, 10, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 2px solid #d46a38;
          padding: 1.5rem 2rem;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 4px 20px rgba(212, 106, 56, 0.2);
        }

        .header-content {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .game-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem;
          font-weight: 700;
          letter-spacing: 1px;
          background: linear-gradient(135deg, #d46a38 0%, #00a896 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 0 30px rgba(212, 106, 56, 0.3);
        }

        .header-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .progress-bar {
          width: 200px;
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #d46a38, #00a896);
          transition: width 0.5s ease;
          box-shadow: 0 0 10px rgba(212, 106, 56, 0.5);
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border: 2px solid #d46a38;
          background: rgba(212, 106, 56, 0.1);
          color: #d46a38;
          font-family: 'Manrope', sans-serif;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 1px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn:hover {
          background: #d46a38;
          color: #0a0a0a;
          box-shadow: 0 4px 15px rgba(212, 106, 56, 0.4);
          transform: translateY(-2px);
        }

        .btn-primary {
          background: linear-gradient(135deg, #d46a38, #c05228);
          border-color: #d46a38;
          color: #fff;
        }

        .btn-primary:hover {
          background: linear-gradient(135deg, #e07a48, #d46a38);
          box-shadow: 0 6px 20px rgba(212, 106, 56, 0.5);
        }

        .main-menu {
          max-width: 1400px;
          margin: 0 auto;
          padding: 4rem 2rem;
          position: relative;
          z-index: 1;
        }

        .menu-hero {
          text-align: center;
          margin-bottom: 4rem;
          animation: fadeInUp 0.8s ease;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .menu-hero h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 4rem;
          font-weight: 700;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #d46a38 0%, #00a896 50%, #d46a38 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: 2px;
          text-shadow: 0 0 40px rgba(212, 106, 56, 0.3);
        }

        .menu-hero p {
          font-size: 1.2rem;
          color: #b8b8b8;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .menu-actions {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin: 3rem 0;
        }

        .menu-card {
          background: rgba(255, 255, 255, 0.03);
          border: 2px solid rgba(212, 106, 56, 0.3);
          border-radius: 8px;
          padding: 2rem;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .menu-card:hover {
          background: rgba(212, 106, 56, 0.1);
          border-color: #d46a38;
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(212, 106, 56, 0.3);
        }

        .menu-card h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.8rem;
          margin-bottom: 0.5rem;
          color: #d46a38;
        }

        .levels-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }

        .level-card {
          background: linear-gradient(135deg, rgba(212, 106, 56, 0.05) 0%, rgba(0, 168, 150, 0.05) 100%);
          border: 2px solid rgba(212, 106, 56, 0.3);
          border-radius: 8px;
          padding: 2rem;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .level-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #d46a38, #00a896);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .level-card:hover::before {
          transform: scaleX(1);
        }

        .level-card:hover {
          border-color: #d46a38;
          box-shadow: 0 8px 25px rgba(212, 106, 56, 0.25);
          transform: translateY(-3px);
        }

        .level-card.locked {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .level-card.completed {
          border-color: #00a896;
        }

        .level-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .level-number {
          font-family: 'Cormorant Garamond', serif;
          font-size: 3rem;
          font-weight: 700;
          color: rgba(212, 106, 56, 0.3);
          line-height: 1;
        }

        .difficulty-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .difficulty-beginner {
          background: rgba(46, 204, 113, 0.2);
          color: #2ecc71;
          border: 1px solid #2ecc71;
        }

        .difficulty-intermediate {
          background: rgba(241, 196, 15, 0.2);
          color: #f1c40f;
          border: 1px solid #f1c40f;
        }

        .difficulty-advanced {
          background: rgba(230, 126, 34, 0.2);
          color: #e67e22;
          border: 1px solid #e67e22;
        }

        .difficulty-expert {
          background: rgba(231, 76, 60, 0.2);
          color: #e74c3c;
          border: 1px solid #e74c3c;
        }

        .level-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: #e8e8e8;
        }

        .level-subtitle {
          color: #d46a38;
          font-size: 0.9rem;
          margin-bottom: 1rem;
          font-weight: 600;
        }

        .level-cities {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin: 1rem 0;
        }

        .city-tag {
          padding: 0.25rem 0.75rem;
          background: rgba(0, 168, 150, 0.2);
          border: 1px solid #00a896;
          border-radius: 12px;
          font-size: 0.75rem;
          color: #00a896;
        }

        .investigation-screen {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem;
          position: relative;
          z-index: 1;
        }

        .investigation-tabs {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          border-bottom: 2px solid rgba(212, 106, 56, 0.3);
          padding-bottom: 1rem;
        }

        .tab {
          padding: 0.75rem 1.5rem;
          background: transparent;
          border: none;
          color: #b8b8b8;
          font-family: 'Manrope', sans-serif;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          border-bottom: 3px solid transparent;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .tab.active {
          color: #d46a38;
          border-bottom-color: #d46a38;
        }

        .tab:hover {
          color: #d46a38;
        }

        .evidence-board {
          background: rgba(255, 255, 255, 0.03);
          border: 2px solid rgba(212, 106, 56, 0.3);
          border-radius: 8px;
          padding: 2rem;
          backdrop-filter: blur(10px);
        }

        .evidence-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-top: 1.5rem;
        }

        .evidence-item {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(212, 106, 56, 0.3);
          border-radius: 6px;
          padding: 1.5rem;
          transition: all 0.3s ease;
          position: relative;
        }

        .evidence-item::before {
          content: '📌';
          position: absolute;
          top: -10px;
          right: -10px;
          font-size: 1.5rem;
          filter: drop-shadow(0 0 10px rgba(212, 106, 56, 0.5));
        }

        .evidence-item:hover {
          border-color: #d46a38;
          transform: rotate(-1deg);
          box-shadow: 0 5px 20px rgba(212, 106, 56, 0.3);
        }

        .character-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .character-card {
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(212, 106, 56, 0.05) 100%);
          border: 2px solid rgba(212, 106, 56, 0.3);
          border-radius: 8px;
          padding: 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .character-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: var(--character-color);
          transition: width 0.3s ease;
        }

        .character-card:hover::before {
          width: 100%;
          opacity: 0.1;
        }

        .character-card:hover {
          border-color: var(--character-color);
          box-shadow: 0 8px 25px rgba(212, 106, 56, 0.3);
          transform: translateY(-3px);
        }

        .threat-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .threat-extreme { background: #e74c3c; color: #fff; }
        .threat-critical { background: #c0392b; color: #fff; }
        .threat-high { background: #e67e22; color: #fff; }
        .threat-medium { background: #f39c12; color: #fff; }
        .threat-low { background: #2ecc71; color: #fff; }
        .threat-ally { background: #3498db; color: #fff; }

        .locations-map {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1.5rem;
        }

        .location-card {
          background: rgba(0, 0, 0, 0.3);
          border: 2px solid rgba(0, 168, 150, 0.3);
          border-radius: 8px;
          padding: 1.5rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .location-card:hover {
          border-color: #00a896;
          box-shadow: 0 5px 20px rgba(0, 168, 150, 0.3);
          transform: scale(1.05);
        }

        .location-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          filter: drop-shadow(0 0 10px rgba(0, 168, 150, 0.5));
        }

        .driving-game {
          background: linear-gradient(180deg, #1a1a2e 0%, #0a0a0a 100%);
          border: 2px solid #d46a38;
          border-radius: 8px;
          padding: 2rem;
          min-height: 400px;
          position: relative;
        }

        .driving-hud {
          display: flex;
          justify-content: space-between;
          margin-bottom: 2rem;
          font-size: 1.5rem;
          font-weight: 700;
        }

        .road {
          width: 100%;
          height: 300px;
          background: linear-gradient(90deg, 
            #333 0%, #333 20%, 
            #444 20%, #444 25%,
            #555 25%, #555 75%,
            #444 75%, #444 80%,
            #333 80%, #333 100%
          );
          position: relative;
          border-radius: 4px;
          overflow: hidden;
          box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.5);
        }

        .obstacle {
          position: absolute;
          bottom: 20px;
          width: 40px;
          height: 40px;
          font-size: 2rem;
          animation: moveDown 2s linear forwards;
        }

        @keyframes moveDown {
          from { bottom: 100%; }
          to { bottom: -50px; }
        }

        .player-car {
          position: absolute;
          bottom: 20px;
          width: 50px;
          height: 50px;
          font-size: 2.5rem;
          transition: left 0.2s ease;
          filter: drop-shadow(0 0 10px rgba(212, 106, 56, 0.5));
        }

        .driving-controls {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-top: 2rem;
        }

        .control-btn {
          padding: 1rem 2rem;
          font-size: 1.2rem;
          font-weight: 700;
          background: linear-gradient(135deg, #d46a38, #c05228);
          border: none;
          color: #fff;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .control-btn:hover {
          background: linear-gradient(135deg, #e07a48, #d46a38);
          box-shadow: 0 5px 20px rgba(212, 106, 56, 0.5);
          transform: scale(1.05);
        }

        .forensics-panel {
          background: rgba(0, 0, 0, 0.5);
          border: 2px solid #00a896;
          border-radius: 8px;
          padding: 2rem;
        }

        .forensics-panel h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem;
          color: #00a896;
          margin-bottom: 1rem;
        }

        .samples-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin: 2rem 0;
        }

        .sample {
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(0, 168, 150, 0.3);
          border-radius: 6px;
          padding: 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .sample:hover {
          border-color: #00a896;
          box-shadow: 0 5px 15px rgba(0, 168, 150, 0.3);
        }

        .sample.selected {
          border-color: #00a896;
          background: rgba(0, 168, 150, 0.2);
          box-shadow: 0 0 20px rgba(0, 168, 150, 0.5);
        }

        .sample-name {
          font-weight: 700;
          color: #00a896;
          margin-bottom: 0.5rem;
        }

        .sample-desc {
          font-size: 0.9rem;
          color: #b8b8b8;
        }

        .analyze-btn {
          padding: 1rem 2rem;
          background: linear-gradient(135deg, #00a896, #008876);
          border: none;
          color: #fff;
          font-weight: 700;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: all 0.3s ease;
          width: 100%;
          margin-top: 1rem;
        }

        .analyze-btn:hover {
          background: linear-gradient(135deg, #00c9b0, #00a896);
          box-shadow: 0 5px 20px rgba(0, 168, 150, 0.5);
          transform: translateY(-2px);
        }

        .objectives-panel {
          background: rgba(0, 0, 0, 0.3);
          border-left: 4px solid #d46a38;
          padding: 1.5rem;
          margin: 2rem 0;
        }

        .objectives-panel h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem;
          color: #d46a38;
          margin-bottom: 1rem;
        }

        .objective-item {
          padding: 0.75rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .objective-item:last-child {
          border-bottom: none;
        }

        .character-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(10px);
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-content {
          background: linear-gradient(135deg, #1a1a2e 0%, #0a0a0a 100%);
          border: 3px solid var(--character-color);
          border-radius: 12px;
          padding: 3rem;
          max-width: 600px;
          width: 90%;
          position: relative;
          animation: slideUp 0.3s ease;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          color: #e8e8e8;
          cursor: pointer;
          font-size: 1.5rem;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .modal-close:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: rotate(90deg);
        }

        .modal-header {
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 2px solid var(--character-color);
        }

        .modal-header h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.5rem;
          color: var(--character-color);
          margin-bottom: 0.5rem;
        }

        .modal-section {
          margin: 1.5rem 0;
        }

        .modal-section h4 {
          color: #d46a38;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 0.5rem;
        }

        .modal-section p {
          color: #e8e8e8;
          line-height: 1.6;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: #888;
        }

        .empty-state-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.3;
        }
      `}</style>

      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1 className="game-title">The Warrior's Wisdom</h1>
          
          <div className="header-actions">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${gameState.gameProgress}%` }}
              />
            </div>
            
            <button onClick={saveGame} className="btn">
              <Save size={18} />
              Save
            </button>
            
            <button onClick={() => setShowMenu(!showMenu)} className="btn">
              <Menu size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      {gameState.currentScene === 'menu' && (
        <div className="main-menu">
          <div className="menu-hero">
            <h1>The Warrior's Wisdom</h1>
            <p>
              Uncover the truth behind the theft of Kenya's priceless Kamba carving. 
              Navigate through corruption, cultural heritage, and international crime 
              across Nairobi, Mombasa, Kisumu, and Turkana.
            </p>
          </div>

          <div className="menu-actions">
            <div className="menu-card" onClick={() => setGameState(prev => ({ ...prev, currentScene: 'levels' }))}>
              <h3>🎮 Play</h3>
              <p>Continue your investigation</p>
            </div>
            
            <div className="menu-card" onClick={loadGame}>
              <h3>📂 Load Game</h3>
              <p>Resume from saved progress</p>
            </div>
            
            <div className="menu-card" onClick={() => setGameState(prev => ({ ...prev, currentScene: 'characters' }))}>
              <h3>👥 Dossiers</h3>
              <p>Review suspect profiles</p>
            </div>
            
            <div className="menu-card" onClick={() => setGameState(prev => ({ ...prev, currentScene: 'about' }))}>
              <h3>ℹ️ About</h3>
              <p>Game information</p>
            </div>
          </div>
        </div>
      )}

      {gameState.currentScene === 'levels' && (
        <div className="investigation-screen">
          <h2 style={{ 
            fontFamily: "'Cormorant Garamond', serif", 
            fontSize: '2.5rem', 
            marginBottom: '2rem',
            color: '#d46a38'
          }}>
            Case Files
          </h2>
          
          <div className="levels-grid">
            {Object.entries(levels).map(([num, level]) => {
              const levelNum = parseInt(num);
              const isLocked = levelNum > gameState.unlockedLevels;
              const isCompleted = gameState.completedLevels.includes(levelNum);
              
              return (
                <div 
                  key={num}
                  className={`level-card ${isLocked ? 'locked' : ''} ${isCompleted ? 'completed' : ''}`}
                  onClick={() => !isLocked && startLevel(levelNum)}
                >
                  <div className="level-header">
                    <div className="level-number">
                      {isCompleted ? '✓' : levelNum}
                    </div>
                    <span className={`difficulty-badge difficulty-${level.difficulty.toLowerCase().replace(' ', '-')}`}>
                      {level.difficulty}
                    </span>
                  </div>
                  
                  <h3 className="level-title">{level.title}</h3>
                  <div className="level-subtitle">{level.subtitle}</div>
                  
                  <div className="level-cities">
                    {level.cities.map(city => (
                      <span key={city} className="city-tag">{city}</span>
                    ))}
                  </div>
                  
                  <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#b8b8b8' }}>
                    {level.objectives.length} objectives • {level.locations.length} locations
                  </div>
                  
                  {isLocked && (
                    <div style={{ 
                      marginTop: '1rem', 
                      color: '#e67e22',
                      fontSize: '0.9rem',
                      fontWeight: 600
                    }}>
                      🔒 Complete Level {levelNum - 1} to unlock
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <button 
            onClick={() => setGameState(prev => ({ ...prev, currentScene: 'menu' }))}
            className="btn"
            style={{ marginTop: '2rem' }}
          >
            ← Back to Menu
          </button>
        </div>
      )}

      {gameState.currentScene === 'investigation' && (
        <div className="investigation-screen">
          <h2 style={{ 
            fontFamily: "'Cormorant Garamond', serif", 
            fontSize: '2.5rem', 
            marginBottom: '1rem',
            color: '#d46a38'
          }}>
            {levels[gameState.currentLevel]?.title}
          </h2>
          
          <div style={{ marginBottom: '2rem', color: '#b8b8b8' }}>
            {levels[gameState.currentLevel]?.subtitle}
          </div>

          <div className="objectives-panel">
            <h3>🎯 Mission Objectives</h3>
            {levels[gameState.currentLevel]?.objectives.map((obj, i) => (
              <div key={i} className="objective-item">
                <span style={{ color: '#d46a38' }}>□</span>
                <span>{obj}</span>
              </div>
            ))}
          </div>

          <div className="investigation-tabs">
            <button 
              className={`tab ${activeTab === 'investigation' ? 'active' : ''}`}
              onClick={() => setActiveTab('investigation')}
            >
              <Search size={20} />
              Investigate
            </button>
            <button 
              className={`tab ${activeTab === 'evidence' ? 'active' : ''}`}
              onClick={() => setActiveTab('evidence')}
            >
              <FileText size={20} />
              Evidence ({gameState.evidence.length})
            </button>
            <button 
              className={`tab ${activeTab === 'locations' ? 'active' : ''}`}
              onClick={() => setActiveTab('locations')}
            >
              <Map size={20} />
              Locations
            </button>
            <button 
              className={`tab ${activeTab === 'suspects' ? 'active' : ''}`}
              onClick={() => setActiveTab('suspects')}
            >
              <Users size={20} />
              Suspects
            </button>
          </div>

          {activeTab === 'investigation' && (
            <div className="evidence-board">
              <h3 style={{ 
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '2rem',
                marginBottom: '1.5rem',
                color: '#e8e8e8'
              }}>
                Active Investigation
              </h3>

              <div style={{ marginBottom: '2rem' }}>
                <button 
                  onClick={() => setForensicsPuzzle(true)}
                  className="btn btn-primary"
                  style={{ marginRight: '1rem' }}
                >
                  <Crosshair size={18} />
                  Run Forensic Analysis
                </button>

                <button 
                  onClick={() => setDrivingGame(true)}
                  className="btn btn-primary"
                  style={{ marginRight: '1rem' }}
                >
                  <Car size={18} />
                  Begin Pursuit
                </button>

                <button 
                  onClick={() => {
                    collectEvidence({
                      type: 'discovery',
                      title: `Level ${gameState.currentLevel} Key Finding`,
                      description: levels[gameState.currentLevel]?.twist,
                      level: gameState.currentLevel
                    });
                  }}
                  className="btn"
                >
                  <Camera size={18} />
                  Document Evidence
                </button>
              </div>

              {forensicsPuzzle && (
                <ForensicsAnalysis 
                  type="wood"
                  onComplete={(success) => {
                    setForensicsPuzzle(false);
                    if (success) {
                      alert('Forensic analysis complete! Evidence added to your files.');
                    }
                  }}
                />
              )}

              {drivingGame && (
                <DrivingSequence 
                  level={gameState.currentLevel}
                  onComplete={(score) => {
                    setDrivingGame(false);
                    setGameState(prev => ({ ...prev, drivingScore: score }));
                    if (score > 50) {
                      collectEvidence({
                        type: 'chase',
                        title: 'Successful Pursuit',
                        description: `Intercepted target vehicle. Score: ${score}`,
                        level: gameState.currentLevel
                      });
                      alert(`Pursuit successful! Score: ${score}`);
                    } else {
                      alert(`Pursuit ended. Score: ${score}. Try again for better results.`);
                    }
                  }}
                />
              )}

              <div style={{ 
                marginTop: '2rem',
                padding: '1.5rem',
                background: 'rgba(212, 106, 56, 0.1)',
                border: '2px solid #d46a38',
                borderRadius: '8px'
              }}>
                <h4 style={{ color: '#d46a38', marginBottom: '0.5rem' }}>
                  🔍 Case Breakthrough
                </h4>
                <p>{levels[gameState.currentLevel]?.twist}</p>
              </div>

              <button 
                onClick={() => {
                  completeLevel(gameState.currentLevel);
                  alert(`Level ${gameState.currentLevel} complete! Next level unlocked.`);
                  setGameState(prev => ({ ...prev, currentScene: 'levels' }));
                }}
                className="btn btn-primary"
                style={{ marginTop: '2rem', width: '100%' }}
              >
                Complete Level {gameState.currentLevel}
              </button>
            </div>
          )}

          {activeTab === 'evidence' && (
            <div className="evidence-board">
              <h3 style={{ 
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '2rem',
                marginBottom: '1.5rem',
                color: '#e8e8e8'
              }}>
                Evidence Board
              </h3>

              {gameState.evidence.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">📋</div>
                  <p>No evidence collected yet. Begin your investigation to gather clues.</p>
                </div>
              ) : (
                <div className="evidence-grid">
                  {gameState.evidence.map((item, i) => (
                    <div key={i} className="evidence-item">
                      <h4 style={{ 
                        color: '#d46a38',
                        marginBottom: '0.5rem',
                        fontWeight: 700
                      }}>
                        {item.title}
                      </h4>
                      <div style={{ 
                        fontSize: '0.85rem',
                        color: '#00a896',
                        marginBottom: '0.5rem'
                      }}>
                        Level {item.level} • {item.type}
                      </div>
                      <p style={{ fontSize: '0.9rem', color: '#b8b8b8' }}>
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'locations' && (
            <div className="evidence-board">
              <h3 style={{ 
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '2rem',
                marginBottom: '1.5rem',
                color: '#e8e8e8'
              }}>
                Accessible Locations
              </h3>

              <div className="locations-map">
                {levels[gameState.currentLevel]?.locations.map(loc => (
                  <div 
                    key={loc.id}
                    className="location-card"
                    onClick={() => setGameState(prev => ({ ...prev, currentLocation: loc.id }))}
                  >
                    <div className="location-icon">{loc.icon}</div>
                    <div style={{ fontWeight: 600, color: '#e8e8e8' }}>
                      {loc.name}
                    </div>
                    {gameState.currentLocation === loc.id && (
                      <div style={{ 
                        marginTop: '0.5rem',
                        color: '#00a896',
                        fontSize: '0.85rem',
                        fontWeight: 600
                      }}>
                        ● Current Location
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'suspects' && (
            <div className="evidence-board">
              <h3 style={{ 
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '2rem',
                marginBottom: '1.5rem',
                color: '#e8e8e8'
              }}>
                Suspect Dossiers
              </h3>

              <div className="character-grid">
                {Object.entries(characters).map(([id, char]) => (
                  <div 
                    key={id}
                    className="character-card"
                    style={{ '--character-color': char.color }}
                    onClick={() => setSelectedCharacter(char)}
                  >
                    <span className={`threat-badge threat-${char.threat.toLowerCase()}`}>
                      {char.threat}
                    </span>
                    
                    <h4 style={{ 
                      fontSize: '1.3rem',
                      marginBottom: '0.25rem',
                      color: '#e8e8e8',
                      fontFamily: "'Cormorant Garamond', serif"
                    }}>
                      {char.name}
                    </h4>
                    
                    <div style={{ 
                      fontSize: '0.9rem',
                      color: char.color,
                      marginBottom: '0.5rem',
                      fontWeight: 600
                    }}>
                      {char.role}
                    </div>
                    
                    <div style={{ fontSize: '0.85rem', color: '#b8b8b8' }}>
                      📍 {char.city}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button 
            onClick={() => setGameState(prev => ({ ...prev, currentScene: 'levels' }))}
            className="btn"
            style={{ marginTop: '2rem' }}
          >
            ← Back to Levels
          </button>
        </div>
      )}

      {gameState.currentScene === 'characters' && (
        <div className="investigation-screen">
          <h2 style={{ 
            fontFamily: "'Cormorant Garamond', serif", 
            fontSize: '2.5rem', 
            marginBottom: '2rem',
            color: '#d46a38'
          }}>
            Suspect Dossiers
          </h2>

          <div className="character-grid">
            {Object.entries(characters).map(([id, char]) => (
              <div 
                key={id}
                className="character-card"
                style={{ '--character-color': char.color }}
                onClick={() => setSelectedCharacter(char)}
              >
                <span className={`threat-badge threat-${char.threat.toLowerCase()}`}>
                  {char.threat}
                </span>
                
                <h4 style={{ 
                  fontSize: '1.3rem',
                  marginBottom: '0.25rem',
                  color: '#e8e8e8',
                  fontFamily: "'Cormorant Garamond', serif"
                }}>
                  {char.name}
                </h4>
                
                <div style={{ 
                  fontSize: '0.9rem',
                  color: char.color,
                  marginBottom: '0.5rem',
                  fontWeight: 600
                }}>
                  {char.role}
                </div>
                
                <div style={{ fontSize: '0.85rem', color: '#b8b8b8' }}>
                  📍 {char.city}
                </div>
                
                <div style={{ 
                  marginTop: '1rem',
                  fontSize: '0.85rem',
                  color: '#b8b8b8',
                  fontStyle: 'italic'
                }}>
                  Click for full profile
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={() => setGameState(prev => ({ ...prev, currentScene: 'menu' }))}
            className="btn"
            style={{ marginTop: '2rem' }}
          >
            ← Back to Menu
          </button>
        </div>
      )}

      {gameState.currentScene === 'about' && (
        <div className="investigation-screen">
          <div className="evidence-board">
            <h2 style={{ 
              fontFamily: "'Cormorant Garamond', serif", 
              fontSize: '2.5rem', 
              marginBottom: '2rem',
              color: '#d46a38'
            }}>
              About The Warrior's Wisdom
            </h2>

            <div style={{ lineHeight: 1.8, color: '#e8e8e8' }}>
              <p style={{ marginBottom: '1.5rem' }}>
                A twist-filled detective game following the theft of the priceless Kamba wood carving 
                "The Warrior's Wisdom" from Nairobi National Museum. The stolen piece is a masterful 
                forgery – the real artifact vanished months earlier, tied to a sprawling web of corruption, 
                black market cartels, and regional cultural heritage stakes spanning Nairobi, Mombasa, 
                Kisumu, and Turkana.
              </p>

              <h3 style={{ 
                color: '#00a896',
                marginTop: '2rem',
                marginBottom: '1rem',
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.8rem'
              }}>
                Game Features
              </h3>
              
              <ul style={{ paddingLeft: '1.5rem' }}>
                <li style={{ marginBottom: '0.75rem' }}>
                  6 Levels of escalating complexity from surface investigations to exposing top officials
                </li>
                <li style={{ marginBottom: '0.75rem' }}>
                  Regional integration across 4+ Kenyan cities with authentic cultural elements
                </li>
                <li style={{ marginBottom: '0.75rem' }}>
                  Modular update system for new content, locations, and mechanics post-launch
                </li>
                <li style={{ marginBottom: '0.75rem' }}>
                  Driving mechanics with urban, highway, and off-road navigation
                </li>
                <li style={{ marginBottom: '0.75rem' }}>
                  Forensic investigation and evidence collection systems
                </li>
                <li style={{ marginBottom: '0.75rem' }}>
                  Multiple endings based on your choices and investigation thoroughness
                </li>
              </ul>

              <h3 style={{ 
                color: '#00a896',
                marginTop: '2rem',
                marginBottom: '1rem',
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.8rem'
              }}>
                Your Mission
              </h3>
              
              <ol style={{ paddingLeft: '1.5rem' }}>
                <li style={{ marginBottom: '0.75rem' }}>
                  Confirm the stolen carving is a forgery and trace its origins
                </li>
                <li style={{ marginBottom: '0.75rem' }}>
                  Locate the real "The Warrior's Wisdom" and the hidden Turkana sapphire
                </li>
                <li style={{ marginBottom: '0.75rem' }}>
                  Expose links between corrupt officials and cross-regional cartels
                </li>
                <li style={{ marginBottom: '0.75rem' }}>
                  Stop the cartel's planned heist of 5 more Kenyan artifacts
                </li>
                <li style={{ marginBottom: '0.75rem' }}>
                  Ensure stolen heritage returns to rightful communities
                </li>
              </ol>
            </div>

            <button 
              onClick={() => setGameState(prev => ({ ...prev, currentScene: 'menu' }))}
              className="btn btn-primary"
              style={{ marginTop: '2rem' }}
            >
              ← Back to Menu
            </button>
          </div>
        </div>
      )}

      {/* Character Modal */}
      {selectedCharacter && (
        <div className="character-modal" onClick={() => setSelectedCharacter(null)}>
          <div 
            className="modal-content"
            style={{ '--character-color': selectedCharacter.color }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={() => setSelectedCharacter(null)}>
              <X size={24} />
            </button>

            <div className="modal-header">
              <h2>{selectedCharacter.name}</h2>
              <div style={{ color: selectedCharacter.color, fontSize: '1.2rem', fontWeight: 600 }}>
                {selectedCharacter.role}
              </div>
            </div>

            <div className="modal-section">
              <h4>Location</h4>
              <p>📍 {selectedCharacter.city}</p>
            </div>

            <div className="modal-section">
              <h4>Public Identity</h4>
              <p>{selectedCharacter.publicIdentity}</p>
            </div>

            <div className="modal-section">
              <h4>🔒 Classified Information</h4>
              <p style={{ color: '#e67e22' }}>{selectedCharacter.hiddenTruth}</p>
            </div>

            <div className="modal-section">
              <h4>Threat Assessment</h4>
              <span className={`threat-badge threat-${selectedCharacter.threat.toLowerCase()}`}>
                {selectedCharacter.threat}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
