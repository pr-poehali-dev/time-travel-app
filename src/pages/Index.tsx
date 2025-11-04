import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

export default function Index() {
  const [mass, setMass] = useState([50]);
  const [timeWarp, setTimeWarp] = useState([0]);
  const [cosmologicalConstant, setCosmologicalConstant] = useState([0.5]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [curvatureData, setCurvatureData] = useState<number[]>([]);

  useEffect(() => {
    const calculateCurvature = () => {
      const M = mass[0];
      const Lambda = (cosmologicalConstant[0] - 0.5) * 2;
      const data = [];
      
      for (let r = 1; r <= 100; r++) {
        const curvature = (2 * M) / r + Lambda * r * r / 3;
        data.push(curvature);
      }
      
      setCurvatureData(data);
    };
    
    calculateCurvature();
  }, [mass, cosmologicalConstant]);

  const handleSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => setIsSimulating(false), 3000);
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
            Путешествия во времени на основе уравнения поля Эйнштейна
          </p>
          <div className="text-sm font-mono bg-card border border-primary/30 rounded-lg p-4 inline-block glow-border">
            R<sub>μν</sub> − ½g<sub>μν</sub>R + Λg<sub>μν</sub> = 8πT<sub>μν</sub>
          </div>
        </header>

        <Tabs defaultValue="simulator" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-card">
            <TabsTrigger value="simulator" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="Gauge" size={18} className="mr-2" />
              Симулятор
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

          <TabsContent value="simulator" className="space-y-6 animate-slide-up">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-primary/30 glow-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Settings" size={24} className="text-primary" />
                    Параметры пространства-времени
                  </CardTitle>
                  <CardDescription>Настройте параметры для искривления метрики</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Icon name="Moon" size={16} className="text-secondary" />
                        Масса (M)
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
                        <Icon name="Clock" size={16} className="text-secondary" />
                        Временное искривление
                      </label>
                      <span className="text-sm font-mono text-primary">{timeWarp[0]}%</span>
                    </div>
                    <Slider
                      value={timeWarp}
                      onValueChange={setTimeWarp}
                      max={100}
                      step={1}
                      className="cursor-pointer"
                    />
                  </div>

                  <Button
                    onClick={handleSimulate}
                    disabled={isSimulating}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold animate-pulse-glow"
                    size="lg"
                  >
                    {isSimulating ? (
                      <>
                        <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                        Симуляция...
                      </>
                    ) : (
                      <>
                        <Icon name="Rocket" size={20} className="mr-2" />
                        Запустить симуляцию
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-primary/30 glow-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Calculator" size={24} className="text-primary" />
                    Расчеты метрики
                  </CardTitle>
                  <CardDescription>Компоненты тензора Эйнштейна</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/50 rounded-lg p-4 border border-primary/20">
                      <div className="text-xs text-muted-foreground mb-1">Тензор Риччи R<sub>μν</sub></div>
                      <div className="text-2xl font-mono text-primary">
                        {(mass[0] * 0.42).toFixed(2)}
                      </div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 border border-primary/20">
                      <div className="text-xs text-muted-foreground mb-1">Скаляр кривизны R</div>
                      <div className="text-2xl font-mono text-primary">
                        {(mass[0] * 0.28 + cosmologicalConstant[0] * 10).toFixed(2)}
                      </div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 border border-primary/20">
                      <div className="text-xs text-muted-foreground mb-1">Энергия T<sub>μν</sub></div>
                      <div className="text-2xl font-mono text-secondary">
                        {(mass[0] * 1.57).toFixed(2)}
                      </div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 border border-primary/20">
                      <div className="text-xs text-muted-foreground mb-1">Метрика g<sub>μν</sub></div>
                      <div className="text-2xl font-mono text-secondary">
                        {(1 - 2 * mass[0] / 100).toFixed(3)}
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-4 space-y-2 border border-secondary/20">
                    <div className="text-sm font-medium text-secondary">Интервал Шварцшильда:</div>
                    <div className="text-xs font-mono text-foreground leading-relaxed">
                      ds² = -(1 - 2M/r)dt² + (1 - 2M/r)⁻¹dr² + r²dΩ²
                    </div>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-4 space-y-2 border border-secondary/20">
                    <div className="text-sm font-medium text-secondary">Горизонт событий:</div>
                    <div className="text-lg font-mono text-primary">
                      r<sub>s</sub> = {(2 * mass[0]).toFixed(1)} км
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
                  Кривизна пространства-времени
                </CardTitle>
                <CardDescription>Визуализация искривления метрики от радиуса</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative h-96 bg-muted/20 rounded-lg overflow-hidden border border-primary/20">
                  <svg width="100%" height="100%" className="absolute inset-0">
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity="0.3" />
                      </linearGradient>
                    </defs>
                    
                    <g transform="translate(40, 20)">
                      <text x="0" y="0" className="text-xs fill-muted-foreground" fontFamily="Roboto Mono">
                        Кривизна
                      </text>
                    </g>
                    
                    <g transform="translate(50, 30)">
                      {curvatureData.map((value, index) => {
                        const x = (index / curvatureData.length) * 700;
                        const y = 350 - Math.min(value * 5, 320);
                        return (
                          <circle
                            key={index}
                            cx={x}
                            cy={y}
                            r="2"
                            fill="hsl(var(--primary))"
                            opacity="0.6"
                          />
                        );
                      })}
                      
                      <path
                        d={curvatureData.map((value, index) => {
                          const x = (index / curvatureData.length) * 700;
                          const y = 350 - Math.min(value * 5, 320);
                          return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                        }).join(' ')}
                        stroke="url(#gradient)"
                        strokeWidth="3"
                        fill="none"
                        className="animate-fade-in"
                      />
                      
                      <line x1="0" y1="350" x2="700" y2="350" stroke="hsl(var(--border))" strokeWidth="1" />
                      <line x1="0" y1="0" x2="0" y2="350" stroke="hsl(var(--border))" strokeWidth="1" />
                      
                      <text x="350" y="380" className="text-xs fill-muted-foreground text-center" fontFamily="Roboto Mono">
                        Радиус (r)
                      </text>
                    </g>
                  </svg>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="bg-muted/30 rounded-lg p-4 text-center border border-primary/20">
                    <Icon name="Orbit" size={32} className="mx-auto mb-2 text-primary" />
                    <div className="text-sm text-muted-foreground">Макс. кривизна</div>
                    <div className="text-xl font-mono text-primary">
                      {Math.max(...curvatureData).toFixed(2)}
                    </div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4 text-center border border-secondary/20">
                    <Icon name="Activity" size={32} className="mx-auto mb-2 text-secondary" />
                    <div className="text-sm text-muted-foreground">Средняя кривизна</div>
                    <div className="text-xl font-mono text-secondary">
                      {(curvatureData.reduce((a, b) => a + b, 0) / curvatureData.length).toFixed(2)}
                    </div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4 text-center border border-primary/20">
                    <Icon name="TrendingDown" size={32} className="mx-auto mb-2 text-primary" />
                    <div className="text-sm text-muted-foreground">Мин. кривизна</div>
                    <div className="text-xl font-mono text-primary">
                      {Math.min(...curvatureData).toFixed(2)}
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
                    Уравнение поля Эйнштейна
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/30 rounded-lg p-4 border border-primary/20">
                    <div className="text-center font-mono text-lg mb-4">
                      R<sub>μν</sub> − ½g<sub>μν</sub>R + Λg<sub>μν</sub> = 8πT<sub>μν</sub>
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex gap-2">
                        <span className="text-primary font-mono">R<sub>μν</sub></span>
                        <span>— тензор Риччи (кривизна)</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-primary font-mono">g<sub>μν</sub></span>
                        <span>— метрический тензор</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-primary font-mono">R</span>
                        <span>— скалярная кривизна</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-secondary font-mono">Λ</span>
                        <span>— космологическая постоянная</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-secondary font-mono">T<sub>μν</sub></span>
                        <span>— тензор энергии-импульса</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Физический смысл</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Уравнение описывает, как материя и энергия искривляют пространство-время. 
                      Левая часть описывает геометрию, правая — содержание материи и энергии.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-secondary/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Sparkles" size={24} className="text-secondary" />
                    Метрика Шварцшильда
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/30 rounded-lg p-4 border border-secondary/20">
                    <div className="text-center font-mono text-sm mb-4">
                      ds² = -(1 - 2M/r)dt² + (1 - 2M/r)⁻¹dr² + r²dΩ²
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Решение уравнений Эйнштейна для сферически-симметричного распределения 
                      массы в вакууме.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-muted/30 rounded-lg p-3 border border-secondary/20">
                      <div className="font-semibold text-sm mb-1 text-secondary">Горизонт событий</div>
                      <div className="text-xs text-muted-foreground">
                        r<sub>s</sub> = 2GM/c² — радиус, за которым ничто не может покинуть черную дыру
                      </div>
                    </div>

                    <div className="bg-muted/30 rounded-lg p-3 border border-secondary/20">
                      <div className="font-semibold text-sm mb-1 text-secondary">Замедление времени</div>
                      <div className="text-xs text-muted-foreground">
                        Время течет медленнее вблизи массивных объектов — основа путешествий во времени
                      </div>
                    </div>

                    <div className="bg-muted/30 rounded-lg p-3 border border-secondary/20">
                      <div className="font-semibold text-sm mb-1 text-secondary">Гравитационное линзирование</div>
                      <div className="text-xs text-muted-foreground">
                        Свет искривляется вблизи массивных объектов, подтверждая теорию относительности
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
