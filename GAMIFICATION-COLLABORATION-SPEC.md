# 🎮 ESPECIFICAÇÃO: GAMIFICAÇÃO E COLABORAÇÃO EM TEMPO REAL

## 🎮 SISTEMA DE GAMIFICAÇÃO

### Sistema de Pontos e Níveis
```typescript
interface UserGamification {
  level: number;           // Nível atual (1-100)
  xp: number;             // Pontos de experiência
  nextLevelXP: number;    // XP necessário para próximo nível
  title: string;          // "ESG Novato", "Especialista ESG", "Mestre ESG"
}

const XP_REWARDS = {
  uploadContract: 10,        // +10 XP por upload
  completeAnalysis: 50,      // +50 XP por análise completa
  findCriticalRisk: 100,     // +100 XP por risco crítico encontrado
  perfectCompliance: 200,    // +200 XP por 100% compliance
  helpColleague: 25,         // +25 XP por ajudar colega
  fastAnalysis: 75          // +75 XP por análise em <5min
};
```

### Sistema de Badges
```typescript
const BADGES = {
  'ESG_ROOKIE': { 
    name: '🌱 ESG Novato', 
    condition: 'Analisar 10 contratos',
    reward: '+50 XP' 
  },
  'CONTRACT_HUNTER': { 
    name: '📋 Caçador de Contratos', 
    condition: 'Analisar 100 contratos',
    reward: '+500 XP + Avatar especial' 
  },
  'RISK_DETECTIVE': { 
    name: '🔍 Detetive de Riscos', 
    condition: 'Identificar 25 riscos críticos',
    reward: '+200 XP + Acesso antecipado a features' 
  },
  'COMPLIANCE_CHAMPION': { 
    name: '🏆 Campeão de Compliance', 
    condition: '30 dias consecutivos com >90% compliance',
    reward: '+1000 XP + Certificado digital' 
  },
  'SPEED_DEMON': { 
    name: '⚡ Demônio da Velocidade', 
    condition: '10 análises em <3 minutos cada',
    reward: '+300 XP + Skin exclusiva' 
  },
  'ECO_WARRIOR': { 
    name: '🌍 Guerreiro Ecológico', 
    condition: 'Melhorar score ambiental de 20 contratos',
    reward: '+400 XP + Planta uma árvore real' 
  }
};
```

### Rankings e Competições
```typescript
interface Leaderboard {
  daily: UserRanking[];      // Ranking diário
  weekly: UserRanking[];     // Ranking semanal  
  monthly: UserRanking[];    // Ranking mensal
  allTime: UserRanking[];    // Ranking histórico
}

const MONTHLY_CHALLENGES = {
  'GREEN_MONTH': {
    name: '🌱 Mês Verde',
    description: 'Quem conseguir melhorar mais scores ambientais',
    prize: 'iPad Pro + Certificação ESG Premium',
    duration: '30 dias'
  },
  'SPEED_WEEK': {
    name: '⚡ Semana da Velocidade', 
    description: 'Análises mais rápidas mantendo qualidade',
    prize: 'Headset premium + Day off',
    duration: '7 dias'
  }
};
```

### Sistema de Recompensas
```typescript
const REWARDS_STORE = {
  // Recompensas Virtuais
  avatars: { cost: 500, items: ['ESG Master Avatar', 'Green Warrior'] },
  themes: { cost: 200, items: ['Dark Pro', 'Ocean Blue'] },
  sounds: { cost: 100, items: ['Achievement Sounds', 'Nature Pack'] },
  
  // Recompensas Físicas  
  giftCards: { cost: 5000, items: ['Amazon $50', 'Starbucks $25'] },
  equipment: { cost: 10000, items: ['Monitor 4K', 'Cadeira Gamer'] },
  experiences: { cost: 20000, items: ['Curso ESG', 'Conferência'] },
  
  // Recompensas Corporativas
  privileges: { cost: 15000, items: ['Home Office Extra', 'Parking VIP'] },
  development: { cost: 8000, items: ['Course Budget', 'Conference Pass'] }
};
```

## 🌐 COLABORAÇÃO EM TEMPO REAL

### Análise Colaborativa de Contratos
```typescript
interface CollaborativeSession {
  contractId: string;
  participants: User[];           // Quem está online
  cursors: UserCursor[];         // Cursores de cada usuário
  selections: UserSelection[];    // Seleções ativas
  comments: LiveComment[];        // Comentários em tempo real
  changes: ChangeStream[];        // Stream de mudanças
}

class RealTimeCollaboration {
  socket: WebSocket;
  
  onUserJoin(user: User) {
    this.broadcastUserPresence(user, 'joined');
    this.showNotification(`${user.name} entrou na análise`);
  }
  
  onScoreChange(userId: string, category: string, newScore: number) {
    this.broadcastChange({
      type: 'score_update',
      user: userId,
      category,
      value: newScore,
      timestamp: Date.now()
    });
  }
}
```

### Comentários Contextuais
```typescript
interface LiveComment {
  id: string;
  userId: string;
  userName: string;
  avatar: string;
  text: string;
  position: { x: number, y: number };  // Posição na tela
  contractSection: string;             // Seção do contrato
  timestamp: Date;
  replies: LiveComment[];              // Respostas aninhadas
  reactions: Reaction[];               // Reações (👍, ❤️, 🤔)
  resolved: boolean;                   // Se foi resolvido
}
```

### Cursores Compartilhados
```typescript
interface UserCursor {
  userId: string;
  userName: string;
  color: string;           // Cor única para cada usuário
  position: Position;      // Posição atual do cursor
  selection?: Selection;   // Texto selecionado
  typing: boolean;         // Se está digitando
}
```

### Chat de Voz/Vídeo
```typescript
class VoiceVideoChat {
  peer: RTCPeerConnection;
  
  async startVoiceCall(roomId: string) {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.addStreamToConnection(stream);
  }
  
  async startScreenShare() {
    const stream = await navigator.mediaDevices.getDisplayMedia();
    this.broadcastScreen(stream);
  }
}
```

## 💡 BENEFÍCIOS ESPERADOS

### Gamificação:
- 📈 +40% engajamento dos usuários
- ⚡ +25% velocidade nas análises  
- 🎯 +60% retenção de usuários
- 🏆 +80% satisfação no trabalho

### Colaboração:
- 🤝 +50% eficiência em projetos em equipe
- 💬 +90% comunicação entre analistas
- ⚡ +35% velocidade em análises complexas
- 🎯 +70% qualidade das análises

## 🚀 IMPLEMENTAÇÃO TÉCNICA

### WebSocket Server Setup
```typescript
import { Server } from 'socket.io';

const io = new Server(server);

io.on('connection', (socket) => {
  socket.on('join-contract', (contractId, userId) => {
    socket.join(`contract:${contractId}`);
    socket.to(`contract:${contractId}`).emit('user-joined', userId);
  });
  
  socket.on('cursor-move', (data) => {
    socket.to(`contract:${data.contractId}`).emit('cursor-update', data);
  });
});
```

### Frontend Components
```typescript
const GamificationPanel = () => (
  <div className="gamification-panel">
    <XPProgressBar currentXP={user.xp} nextLevelXP={user.nextLevelXP} />
    <RecentBadges badges={user.recentBadges} />
    <MiniLeaderboard top5={leaderboard.slice(0, 5)} />
    <ActiveChallenge challenge={currentChallenge} />
  </div>
);

const CollaborativeComments = () => (
  <div className="live-comments-overlay">
    {comments.map(comment => (
      <CommentBubble key={comment.id} {...comment} />
    ))}
  </div>
);
```

---

**Esta especificação serve como base para implementação dos sistemas de gamificação e colaboração em tempo real no SHELL AI ESG.**