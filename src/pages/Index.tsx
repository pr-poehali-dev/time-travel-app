import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Icon from '@/components/ui/icon';

export default function Index() {
  const [mass, setMass] = useState([50]);
  const [angularMomentum, setAngularMomentum] = useState([0.5]);
  const [cosmologicalConstant, setCosmologicalConstant] = useState([0.5]);
  const [quantumEnergy, setQuantumEnergy] = useState([0]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [energyLevel, setEnergyLevel] = useState(0);
  const [curvatureData, setCurvatureData] = useState<number[]>([]);
  const [wormholeStability, setWormholeStability] = useState(0);
  const [hawkingRadiation, setHawkingRadiation] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const calculatePhysics = () => {
      const M = mass[0];
      const a = angularMomentum[0];
      const Lambda = (cosmologicalConstant[0] - 0.5) * 2;
      const Q = quantumEnergy[0];
      
      const data = [];
      for (let r = 1; r <= 100; r++) {
        const kerrMetric = (2 * M) / r + Lambda * r * r / 3 - (a * a) / (r * r);
        const quantumFluctuation = Q * Math.sin(r * 0.1) * 0.1;
        const curvature = kerrMetric + quantumFluctuation;
        data.push(curvature);
      }
      setCurvatureData(data);

      const casimirEnergy = -0.5 * Math.PI * Math.PI / (M * 12);
      const stability = Math.max(0, Math.min(100, 50 + casimirEnergy * 100 + Q * 50));
      setWormholeStability(stability);

      const hawking = (1 / (8 * Math.PI * M)) * 100;
      setHawkingRadiation(hawking);

      const totalEnergy = M * a * Lambda * (1 + Q);
      setEnergyLevel(Math.min(100, totalEnergy));
    };
    
    calculatePhysics();
  }, [mass, angularMomentum, cosmologicalConstant, quantumEnergy]);

  useEffect(() => {
    if (isActivated && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && isActivated) {
      setIsSimulating(true);
      setTimeout(() => {
        setIsSimulating(false);
        setIsActivated(false);
        setCountdown(10);
      }, 5000);
    }
  }, [isActivated, countdown]);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let frame = 0;
    const animate = () => {
      ctx.fillStyle = 'rgba(10, 10, 20, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      for (let i = 0; i < 100; i++) {
        const angle = (i / 100) * Math.PI * 2 + frame * 0.01;
        const radius = 50 + Math.sin(frame * 0.05 + i * 0.1) * 30;
        const distortion = isSimulating ? Math.sin(frame * 0.1) * 20 : 0;
        
        const x = centerX + Math.cos(angle) * (radius + distortion);
        const y = centerY + Math.sin(angle) * (radius + distortion);
        
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = isSimulating 
          ? `hsl(${199 + Math.sin(frame * 0.1 + i) * 40}, 89%, 48%)`
          : `hsl(${199}, 89%, ${48 + Math.sin(i * 0.1) * 20}%)`;
        ctx.fill();
      }

      frame++;
      requestAnimationFrame(animate);
    };

    animate();
  }, [isSimulating]);

  const handleActivate = () => {
    if (energyLevel >= 50 && wormholeStability >= 30) {
      setIsActivated(true);
      setCountdown(10);
    }
  };

  return (
    <div className="min-h-screen bg-background grid-bg p-6">
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        <header className="text-center space-y-4 py-8">
          <h1 className="text-5xl font-bold glow-text flex items-center justify-center gap-4">
            <Icon name="Zap" size={48} className="text-primary" />
            Машина времени
          </h1>
          <p className="text-xl text-muted-foreground">
            Квантовый симулятор путешествий во времени
          </p>
          <div className="text-sm font-mono bg-card border border-primary/30 rounded-lg p-4 inline-block glow-border">
            ds² = -(1 - 2M/ρ²)dt² + ρ²/(ρ² + a²cos²θ)dr² + Quantum Corrections
          </div>
          
          {isActivated && (
            <Alert className="border-destructive bg-destructive/10 max-w-md mx-auto animate-pulse-glow">
              <Icon name="AlertTriangle" size={20} className="text-destructive" />
              <AlertDescription className="text-destructive font-bold text-lg">
                АКТИВАЦИЯ ЧЕРЕЗ {countdown} СЕКУНД
              </AlertDescription>
            </Alert>
          )}
        </header>

        <Tabs defaultValue="control" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-card">
            <TabsTrigger value="control" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="Gauge" size={18} className="mr-2" />
              Управление
            </TabsTrigger>
            <TabsTrigger value="quantum" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="Atom" size={18} className="mr-2" />
              Квантовая физика
            </TabsTrigger>
            <TabsTrigger value="visualization" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="LineChart" size={18} className="mr-2" />
              Визуализация
            </TabsTrigger>
            <TabsTrigger value="theory" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="BookOpen" size={18} className="mr-2" />
              Теория
            </TabsTrigger>
          </TabsList>

          <TabsContent value="control" className="space-y-6 animate-slide-up">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-primary/30 glow-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Settings" size={24} className="text-primary" />
                    Параметры метрики Керра
                  </CardTitle>
                  <CardDescription>Вращающаяся черная дыра для искривления времени</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Icon name="Moon" size={16} className="text-secondary" />
                        Масса черной дыры (M)
                      </label>
                      <span className="text-sm font-mono text-primary">{mass[0]} M☉</span>
                    </div>
                    <Slider
                      value={mass}
                      onValueChange={setMass}
                      max={100}
                      step={1}
                      className="cursor-pointer"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Icon name="Orbit" size={16} className="text-secondary" />
                        Угловой момент (a)
                      </label>
                      <span className="text-sm font-mono text-primary">
                        {(angularMomentum[0]).toFixed(2)} J/M
                      </span>
                    </div>
                    <Slider
                      value={angularMomentum}
                      onValueChange={setAngularMomentum}
                      max={1}
                      step={0.01}
                      className="cursor-pointer"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Icon name="Sparkles" size={16} className="text-secondary" />
                        Космологическая постоянная (Λ)
                      </label>
                      <span className="text-sm font-mono text-primary">
                        {((cosmologicalConstant[0] - 0.5) * 2).toFixed(2)}
                      </span>
                    </div>
                    <Slider
                      value={cosmologicalConstant}
                      onValueChange={setCosmologicalConstant}
                      max={1}
                      step={0.01}
                      className="cursor-pointer"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Icon name="Zap" size={16} className="text-secondary" />
                        Квантовая энергия
                      </label>
                      <span className="text-sm font-mono text-primary">{quantumEnergy[0]}%</span>
                    </div>
                    <Slider
                      value={quantumEnergy}
                      onValueChange={setQuantumEnergy}
                      max={100}
                      step={1}
                      className="cursor-pointer"
                    />
                  </div>

                  <Button
                    onClick={handleActivate}
                    disabled={isActivated || isSimulating || energyLevel < 50 || wormholeStability < 30}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold animate-pulse-glow"
                    size="lg"
                  >
                    {isSimulating ? (
                      <>
                        <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                        ПРЫЖОК В ВРЕМЕНИ...
                      </>
                    ) : isActivated ? (
                      <>
                        <Icon name="AlertTriangle" size={20} className="mr-2" />
                        ЗАПУСК ЧЕРЕЗ {countdown}с
                      </>
                    ) : (
                      <>
                        <Icon name="Rocket" size={20} className="mr-2" />
                        АКТИВИРОВАТЬ МАШИНУ
                      </>
                    )}
                  </Button>
                  
                  {energyLevel < 50 && (
                    <p className="text-xs text-muted-foreground text-center">
                      Недостаточно энергии. Увеличьте параметры.
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="border-primary/30 glow-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Activity" size={24} className="text-primary" />
                    Состояние системы
                  </CardTitle>
                  <CardDescription>Физические параметры в реальном времени</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Уровень энергии</span>
                      <span className="text-sm font-mono text-primary">{energyLevel.toFixed(1)}%</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${
                          energyLevel >= 80 ? 'bg-destructive' : 
                          energyLevel >= 50 ? 'bg-primary' : 'bg-secondary'
                        }`}
                        style={{ width: `${energyLevel}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Стабильность червоточины</span>
                      <span className="text-sm font-mono text-secondary">{wormholeStability.toFixed(1)}%</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${
                          wormholeStability >= 70 ? 'bg-primary' : 
                          wormholeStability >= 30 ? 'bg-secondary' : 'bg-destructive'
                        }`}
                        style={{ width: `${wormholeStability}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-muted/50 rounded-lg p-4 border border-primary/20">
                      <div className="text-xs text-muted-foreground mb-1">Излучение Хокинга</div>
                      <div className="text-2xl font-mono text-primary">
                        {hawkingRadiation.toFixed(3)}
                      </div>
                      <div className="text-xs text-muted-foreground">K⁻¹</div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 border border-primary/20">
                      <div className="text-xs text-muted-foreground mb-1">Энергия Казимира</div>
                      <div className="text-2xl font-mono text-secondary">
                        {(-(Math.PI * Math.PI) / (mass[0] * 12)).toFixed(4)}
                      </div>
                      <div className="text-xs text-muted-foreground">ℏc/m⁴</div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 border border-secondary/20">
                      <div className="text-xs text-muted-foreground mb-1">Горизонт событий</div>
                      <div className="text-2xl font-mono text-secondary">
                        {(mass[0] + Math.sqrt(mass[0] * mass[0] - angularMomentum[0] * angularMomentum[0])).toFixed(1)}
                      </div>
                      <div className="text-xs text-muted-foreground">км</div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 border border-secondary/20">
                      <div className="text-xs text-muted-foreground mb-1">Эргосфера</div>
                      <div className="text-2xl font-mono text-primary">
                        {(mass[0] + Math.sqrt(mass[0] * mass[0] - angularMomentum[0] * angularMomentum[0] * Math.cos(Math.PI/4) * Math.cos(Math.PI/4))).toFixed(1)}
                      </div>
                      <div className="text-xs text-muted-foreground">км</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="quantum" className="animate-slide-up">
            <Card className="border-secondary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Atom" size={24} className="text-secondary" />
                  Квантовая механика и червоточины
                </CardTitle>
                <CardDescription>Эффект Казимира для стабилизации экзотической материи</CardDescription>
              </CardHeader>
              <CardContent>
                <canvas 
                  ref={canvasRef} 
                  className="w-full h-96 rounded-lg border border-secondary/20 bg-muted/20"
                />
                
                <div className="grid md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-muted/30 rounded-lg p-4 border border-secondary/20">
                    <Icon name="Waves" size={32} className="mb-2 text-secondary" />
                    <h4 className="font-semibold text-sm mb-2">Квантовые флуктуации</h4>
                    <p className="text-xs text-muted-foreground">
                      Виртуальные частицы в вакууме создают отрицательную энергию, 
                      необходимую для стабилизации червоточины
                    </p>
                  </div>
                  
                  <div className="bg-muted/30 rounded-lg p-4 border border-secondary/20">
                    <Icon name="Cpu" size={32} className="mb-2 text-secondary" />
                    <h4 className="font-semibold text-sm mb-2">Эффект Казимира</h4>
                    <p className="text-xs text-muted-foreground">
                      Две близкие пластины создают отрицательное давление из-за 
                      квантовых флуктуаций между ними
                    </p>
                  </div>
                  
                  <div className="bg-muted/30 rounded-lg p-4 border border-secondary/20">
                    <Icon name="RadioTower" size={32} className="mb-2 text-secondary" />
                    <h4 className="font-semibold text-sm mb-2">Излучение Хокинга</h4>
                    <p className="text-xs text-muted-foreground">
                      Черные дыры испускают тепловое излучение из-за квантовых эффектов 
                      вблизи горизонта событий
                    </p>
                  </div>
                </div>

                <div className="mt-6 bg-muted/20 rounded-lg p-4 border border-primary/20">
                  <h4 className="font-semibold text-sm mb-3 text-primary">Уравнение энергии Казимира:</h4>
                  <div className="text-center font-mono text-lg mb-2">
                    E = -ℏcπ²/(720d³)
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    где d — расстояние между пластинами, ℏ — постоянная Планка, c — скорость света
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="visualization" className="animate-slide-up">
            <Card className="border-primary/30 glow-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="TrendingUp" size={24} className="text-primary" />
                  Кривизна пространства-времени (Метрика Керра)
                </CardTitle>
                <CardDescription>Влияние вращения на геометрию пространства</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative h-96 bg-muted/20 rounded-lg overflow-hidden border border-primary/20">
                  <svg width="100%" height="100%" className="absolute inset-0">
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity="0.3" />
                      </linearGradient>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>
                    
                    <g transform="translate(40, 20)">
                      <text x="0" y="0" className="text-xs fill-muted-foreground" fontFamily="Roboto Mono">
                        Кривизна
                      </text>
                    </g>
                    
                    <g transform="translate(50, 30)">
                      {curvatureData.map((value, index) => {
                        const x = (index / curvatureData.length) * 700;
                        const y = 350 - Math.min(Math.abs(value) * 5, 320);
                        return (
                          <circle
                            key={index}
                            cx={x}
                            cy={y}
                            r="2"
                            fill="hsl(var(--primary))"
                            opacity="0.6"
                            filter="url(#glow)"
                          />
                        );
                      })}
                      
                      <path
                        d={curvatureData.map((value, index) => {
                          const x = (index / curvatureData.length) * 700;
                          const y = 350 - Math.min(Math.abs(value) * 5, 320);
                          return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                        }).join(' ')}
                        stroke="url(#gradient)"
                        strokeWidth="3"
                        fill="none"
                        filter="url(#glow)"
                        className="animate-fade-in"
                      />
                      
                      <line x1="0" y1="350" x2="700" y2="350" stroke="hsl(var(--border))" strokeWidth="1" />
                      <line x1="0" y1="0" x2="0" y2="350" stroke="hsl(var(--border))" strokeWidth="1" />
                      
                      <text x="350" y="380" className="text-xs fill-muted-foreground text-center" fontFamily="Roboto Mono">
                        Радиус (r) от горизонта событий
                      </text>
                    </g>
                  </svg>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="bg-muted/30 rounded-lg p-4 text-center border border-primary/20">
                    <Icon name="Orbit" size={32} className="mx-auto mb-2 text-primary" />
                    <div className="text-sm text-muted-foreground">Макс. кривизна</div>
                    <div className="text-xl font-mono text-primary">
                      {Math.max(...curvatureData.map(v => Math.abs(v))).toFixed(2)}
                    </div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4 text-center border border-secondary/20">
                    <Icon name="Activity" size={32} className="mx-auto mb-2 text-secondary" />
                    <div className="text-sm text-muted-foreground">Средняя кривизна</div>
                    <div className="text-xl font-mono text-secondary">
                      {(curvatureData.reduce((a, b) => a + Math.abs(b), 0) / curvatureData.length).toFixed(2)}
                    </div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4 text-center border border-primary/20">
                    <Icon name="Radar" size={32} className="mx-auto mb-2 text-primary" />
                    <div className="text-sm text-muted-foreground">Сингулярность</div>
                    <div className="text-xl font-mono text-primary">
                      {(Math.sqrt(mass[0] * mass[0] - angularMomentum[0] * angularMomentum[0])).toFixed(2)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="theory" className="animate-slide-up">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-primary/30 glow-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Atom" size={24} className="text-primary" />
                    Метрика Керра
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/30 rounded-lg p-4 border border-primary/20">
                    <div className="text-center font-mono text-sm mb-4 leading-relaxed">
                      ds² = -(1 - 2Mr/ρ²)dt² - 4Mar sin²θ/ρ² dtdφ + <br/>
                      + ρ²/Δ dr² + ρ²dθ² + (r² + a² + 2Ma²r sin²θ/ρ²)sin²θ dφ²
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex gap-2">
                        <span className="text-primary font-mono">ρ²</span>
                        <span>= r² + a²cos²θ</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-primary font-mono">Δ</span>
                        <span>= r² - 2Mr + a²</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-primary font-mono">a</span>
                        <span>= J/M — удельный угловой момент</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Эргосфера и эффект Пенроуза</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Вращающаяся черная дыра создает эргосферу — область, где пространство-время 
                      вращается со скоростью света. Здесь возможно извлечение энергии через процесс Пенроуза.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-secondary/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Sparkles" size={24} className="text-secondary" />
                    Экзотическая материя
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/30 rounded-lg p-4 border border-secondary/20">
                    <div className="text-center font-mono text-sm mb-4">
                      T<sub>μν</sub> = -ℏcπ²/(720d⁴) g<sub>μν</sub>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Отрицательная плотность энергии, создаваемая эффектом Казимира, 
                      теоретически способна стабилизировать червоточину.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-muted/30 rounded-lg p-3 border border-secondary/20">
                      <div className="font-semibold text-sm mb-1 text-secondary">Условие слабой энергии</div>
                      <div className="text-xs text-muted-foreground">
                        T<sub>μν</sub>t<sup>μ</sup>t<sup>ν</sup> ≥ 0 — нарушается для червоточин, требуется экзотическая материя
                      </div>
                    </div>

                    <div className="bg-muted/30 rounded-lg p-3 border border-secondary/20">
                      <div className="font-semibold text-sm mb-1 text-secondary">Проблема стабильности</div>
                      <div className="text-xs text-muted-foreground">
                        Червоточины нестабильны и коллапсируют быстрее скорости света без экзотической материи
                      </div>
                    </div>

                    <div className="bg-muted/30 rounded-lg p-3 border border-secondary/20">
                      <div className="font-semibold text-sm mb-1 text-secondary">Эффект Унру</div>
                      <div className="text-xs text-muted-foreground">
                        T<sub>Unruh</sub> = ℏa/(2πck<sub>B</sub>) — ускоренный наблюдатель видит излучение в вакууме
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
