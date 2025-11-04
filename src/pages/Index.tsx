import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Icon from '@/components/ui/icon';

export default function Index() {
  const [mass, setMass] = useState([100]);
  const [angularMomentum, setAngularMomentum] = useState([0.99]);
  const [cosmologicalConstant, setCosmologicalConstant] = useState([1]);
  const [quantumEnergy, setQuantumEnergy] = useState([100]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [energyLevel, setEnergyLevel] = useState(0);
  const [curvatureData, setCurvatureData] = useState<number[]>([]);
  const [wormholeStability, setWormholeStability] = useState(0);
  const [hawkingRadiation, setHawkingRadiation] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userLocation, setUserLocation] = useState<{lat: number, lon: number} | null>(null);
  const [deviceMotion, setDeviceMotion] = useState({ x: 0, y: 0, z: 0 });
  const [gravWaveDetected, setGravWaveDetected] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          console.log('Геолокация недоступна:', error);
        }
      );
    }
  }, []);

  useEffect(() => {
    const handleMotion = (event: DeviceMotionEvent) => {
      if (event.accelerationIncludingGravity) {
        const x = event.accelerationIncludingGravity.x || 0;
        const y = event.accelerationIncludingGravity.y || 0;
        const z = event.accelerationIncludingGravity.z || 0;
        setDeviceMotion({ x, y, z });
        
        const magnitude = Math.sqrt(x*x + y*y + z*z);
        if (magnitude > 15 && isSimulating) {
          setGravWaveDetected(true);
          setTimeout(() => setGravWaveDetected(false), 2000);
        }
      }
    };

    if (window.DeviceMotionEvent) {
      if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
        (DeviceMotionEvent as any).requestPermission()
          .then((permissionState: string) => {
            if (permissionState === 'granted') {
              window.addEventListener('devicemotion', handleMotion);
            }
          })
          .catch(console.error);
      } else {
        window.addEventListener('devicemotion', handleMotion);
      }
    }

    return () => {
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, [isSimulating]);

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

      const totalEnergy = M * a * Lambda * (1 + Q / 100);
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
      const startTime = Date.now();
      
      setTimeout(() => {
        const endTime = Date.now();
        const timeDiff = endTime - startTime;
        console.log(`⏱️ ПОПЫТКА ПРЫЖКА ЗАВЕРШЕНА`);
        console.log(`📍 Координаты: ${userLocation?.lat.toFixed(4)}, ${userLocation?.lon.toFixed(4)}`);
        console.log(`⚡ Энергия: ${energyLevel.toFixed(2)}%`);
        console.log(`🌀 Стабильность червоточины: ${wormholeStability.toFixed(2)}%`);
        console.log(`⏰ Прошло времени: ${timeDiff}ms`);
        console.log(`🔬 Детектор движения: x=${deviceMotion.x.toFixed(2)}, y=${deviceMotion.y.toFixed(2)}, z=${deviceMotion.z.toFixed(2)}`);
        
        setIsSimulating(false);
        setIsActivated(false);
        setCountdown(10);
      }, 5000);
    }
  }, [isActivated, countdown, energyLevel, wormholeStability, userLocation, deviceMotion]);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let frame = 0;
    let animationId: number;
    
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
      animationId = requestAnimationFrame(animate);
    };

    animate();
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isSimulating]);

  const handleActivate = () => {
    setIsActivated(true);
    setCountdown(10);
  };

  const handleMaxPower = () => {
    setMass([100]);
    setAngularMomentum([0.99]);
    setCosmologicalConstant([1]);
    setQuantumEnergy([100]);
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
            Экспериментальная система временных перемещений
          </p>
          <div className="text-sm font-mono bg-card border border-primary/30 rounded-lg p-4 inline-block glow-border">
            ds² = -(1 - 2M/ρ²)dt² + ρ²/(ρ² + a²cos²θ)dr² + Quantum Corrections
          </div>
          
          <div className="flex gap-4 justify-center items-center flex-wrap">
            <div className="bg-card border border-primary/20 rounded-lg px-4 py-2">
              <div className="text-xs text-muted-foreground">Текущее время</div>
              <div className="text-lg font-mono text-primary">
                {currentTime.toLocaleTimeString('ru-RU')}
              </div>
            </div>
            {userLocation && (
              <div className="bg-card border border-secondary/20 rounded-lg px-4 py-2">
                <div className="text-xs text-muted-foreground">Координаты</div>
                <div className="text-sm font-mono text-secondary">
                  {userLocation.lat.toFixed(4)}, {userLocation.lon.toFixed(4)}
                </div>
              </div>
            )}
          </div>
          
          {isActivated && (
            <Alert className="border-destructive bg-destructive/10 max-w-md mx-auto animate-pulse-glow">
              <Icon name="AlertTriangle" size={20} className="text-destructive" />
              <AlertDescription className="text-destructive font-bold text-lg">
                АКТИВАЦИЯ ЧЕРЕЗ {countdown} СЕКУНД
              </AlertDescription>
            </Alert>
          )}
          
          {gravWaveDetected && (
            <Alert className="border-primary bg-primary/10 max-w-md mx-auto animate-pulse-glow">
              <Icon name="Radio" size={20} className="text-primary" />
              <AlertDescription className="text-primary font-bold">
                🌊 ГРАВИТАЦИОННАЯ ВОЛНА ОБНАРУЖЕНА!
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
            <TabsTrigger value="sensors" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="Radar" size={18} className="mr-2" />
              Сенсоры
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
                    onClick={handleMaxPower}
                    variant="outline"
                    className="w-full border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
                  >
                    <Icon name="TrendingUp" size={20} className="mr-2" />
                    МАКСИМАЛЬНАЯ МОЩНОСТЬ
                  </Button>

                  <Button
                    onClick={handleActivate}
                    disabled={isActivated || isSimulating}
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
                      <span className="text-sm">Уровень энергии (E=mc²)</span>
                      <span className="text-sm font-mono text-primary">{energyLevel.toFixed(1)}%</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full transition-all duration-500 bg-primary animate-pulse-glow"
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
                        className="h-full transition-all duration-500 bg-secondary"
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
                        {(mass[0] + Math.sqrt(Math.max(0, mass[0] * mass[0] - angularMomentum[0] * angularMomentum[0]))).toFixed(1)}
                      </div>
                      <div className="text-xs text-muted-foreground">км</div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 border border-secondary/20">
                      <div className="text-xs text-muted-foreground mb-1">Эргосфера</div>
                      <div className="text-2xl font-mono text-primary">
                        {(mass[0] + Math.sqrt(Math.max(0, mass[0] * mass[0] - angularMomentum[0] * angularMomentum[0] * 0.5))).toFixed(1)}
                      </div>
                      <div className="text-xs text-muted-foreground">км</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sensors" className="animate-slide-up">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-secondary/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Compass" size={24} className="text-secondary" />
                    Детектор движения
                  </CardTitle>
                  <CardDescription>Акселерометр устройства (гравитационные волны)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-muted/30 rounded-lg p-4 text-center">
                        <div className="text-xs text-muted-foreground mb-1">X ось</div>
                        <div className="text-xl font-mono text-primary">{deviceMotion.x.toFixed(2)}</div>
                        <div className="text-xs text-muted-foreground">m/s²</div>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-4 text-center">
                        <div className="text-xs text-muted-foreground mb-1">Y ось</div>
                        <div className="text-xl font-mono text-secondary">{deviceMotion.y.toFixed(2)}</div>
                        <div className="text-xs text-muted-foreground">m/s²</div>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-4 text-center">
                        <div className="text-xs text-muted-foreground mb-1">Z ось</div>
                        <div className="text-xl font-mono text-primary">{deviceMotion.z.toFixed(2)}</div>
                        <div className="text-xs text-muted-foreground">m/s²</div>
                      </div>
                    </div>
                    
                    <div className="bg-muted/20 rounded-lg p-4">
                      <h4 className="text-sm font-semibold mb-2">Магнитуда ускорения</h4>
                      <div className="text-3xl font-mono text-primary">
                        {Math.sqrt(deviceMotion.x**2 + deviceMotion.y**2 + deviceMotion.z**2).toFixed(2)} m/s²
                      </div>
                    </div>

                    <Alert className="border-secondary/50">
                      <Icon name="Info" size={16} />
                      <AlertDescription className="text-xs">
                        Сильное ускорение (&gt;15 m/s²) во время активации может указывать на 
                        локальное искривление пространства-времени
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/30 glow-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Atom" size={24} className="text-primary" />
                    Квантовая запутанность
                  </CardTitle>
                  <CardDescription>Визуализация квантовых флуктуаций</CardDescription>
                </CardHeader>
                <CardContent>
                  <canvas 
                    ref={canvasRef} 
                    className="w-full h-64 rounded-lg border border-primary/20 bg-muted/20"
                  />
                  
                  <div className="mt-4 space-y-2">
                    <div className="bg-muted/30 rounded-lg p-3">
                      <div className="text-xs text-muted-foreground mb-1">Когерентность квантовых состояний</div>
                      <div className="text-lg font-mono text-primary">
                        {(Math.abs(Math.sin(Date.now() / 1000)) * 100).toFixed(1)}%
                      </div>
                    </div>
                    
                    <div className="bg-muted/30 rounded-lg p-3">
                      <div className="text-xs text-muted-foreground mb-1">Энтропия фон Неймана</div>
                      <div className="text-lg font-mono text-secondary">
                        {(Math.log(quantumEnergy[0] + 1) * 1.5).toFixed(3)} bits
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
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
                      {Math.sqrt(Math.max(0, mass[0] * mass[0] - angularMomentum[0] * angularMomentum[0])).toFixed(2)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="theory" className="animate-slide-up">
            <div className="space-y-6">
              <Alert className="border-destructive bg-destructive/10">
                <Icon name="AlertTriangle" size={20} className="text-destructive" />
                <AlertDescription className="text-destructive">
                  <strong>⚠️ ВАЖНОЕ ПРЕДУПРЕЖДЕНИЕ:</strong> Это экспериментальная система. 
                  Реальные путешествия во времени требуют энергии, превышающей выход целой звезды (10⁴⁶ Дж). 
                  Данное приложение использует реальные формулы физики, но не может создать физическую червоточину. 
                  Возможны парадоксы причинности при успешной активации.
                </AlertDescription>
              </Alert>

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
                      Требования для активации
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="bg-muted/30 rounded-lg p-3 border border-secondary/20">
                      <div className="font-semibold text-sm mb-1 text-secondary">E = mc²</div>
                      <div className="text-xs text-muted-foreground">
                        Необходимая энергия: ~10⁴⁶ джоулей (энергия сверхновой)
                      </div>
                    </div>

                    <div className="bg-muted/30 rounded-lg p-3 border border-secondary/20">
                      <div className="font-semibold text-sm mb-1 text-secondary">Экзотическая материя</div>
                      <div className="text-xs text-muted-foreground">
                        Отрицательная плотность энергии для стабилизации червоточины
                      </div>
                    </div>

                    <div className="bg-muted/30 rounded-lg p-3 border border-secondary/20">
                      <div className="font-semibold text-sm mb-1 text-secondary">Парадоксы</div>
                      <div className="text-xs text-muted-foreground">
                        Парадокс дедушки, причинные петли, множественные временные линии
                      </div>
                    </div>

                    <div className="bg-muted/30 rounded-lg p-3 border border-secondary/20">
                      <div className="font-semibold text-sm mb-1 text-secondary">Квантовая запутанность</div>
                      <div className="text-xs text-muted-foreground">
                        |ψ⟩ = α|0⟩ + β|1⟩ — суперпозиция состояний для временной связи
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}