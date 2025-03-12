"use client";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  CheckCircleIcon,
  ChevronRightIcon,
  RocketLaunchIcon,
  SparklesIcon,
  ChartBarIcon,
  ClockIcon,
  BellIcon,
  BookOpenIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const features = [
  {
    icon: <ClockIcon className="h-8 w-8 text-indigo-400" />,
    title: "Sistema de Tarefas",
    description: "Transforme suas atividades diárias em conquistas",
    benefits: [
      "Sistema de XP e níveis",
      "Conquistas especiais",
      "Rastreamento de progresso",
      "Recompensas diárias",
    ],
    color: "from-blue-500 to-indigo-500",
  },
  {
    icon: <ChartBarIcon className="h-8 w-8 text-purple-400" />,
    title: "Cronogramas Inteligentes",
    description: "Gerencie seu tempo de forma inteligente e eficaz",
    benefits: [
      "IA para otimização",
      "Blocos flexíveis",
      "Análise de performance",
      "Sugestões personalizadas",
    ],
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: <BellIcon className="h-8 w-8 text-rose-400" />,
    title: "Lembretes Eficientes",
    description: "Nunca perca um compromisso importante",
    benefits: [
      "Notificações inteligentes",
      "Priorização automática",
      "Sincronização em tempo real",
      "Lembretes contextuais",
    ],
    color: "from-rose-500 to-red-500",
  },
  {
    icon: <BookOpenIcon className="h-8 w-8 text-amber-400" />,
    title: "Diário Digital",
    description: "Registre sua jornada e acompanhe seu crescimento",
    benefits: [
      "Análise de sentimentos",
      "Histórico visual",
      "Templates personalizados",
      "Backup em nuvem",
    ],
    color: "from-amber-500 to-yellow-500",
  },
];

const stats = [
  { label: "Usuários Ativos", value: "50K+" },
  { label: "Tarefas Completadas", value: "1M+" },
  { label: "Tempo Economizado", value: "2000h+" },
  { label: "Avaliação Média", value: "4.9/5" },
];

const testimonials = [
  {
    name: "Maria Silva",
    role: "Estudante de Medicina",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    content:
      "TaskMaster revolucionou minha rotina de estudos! O sistema de recompensas me mantém super motivada.",
    stats: { tasks: 234, streak: 45, hours: 120 },
  },
  {
    name: "João Santos",
    role: "Desenvolvedor Full-Stack",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    content:
      "A IA para otimização de tempo é incrível. Aumentei minha produtividade em mais de 40%!",
    stats: { tasks: 567, streak: 89, hours: 200 },
  },
  {
    name: "Ana Costa",
    role: "Designer UX/UI",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    content:
      "Os lembretes inteligentes e a gamificação tornaram minhas tarefas muito mais envolventes.",
    stats: { tasks: 345, streak: 60, hours: 150 },
  },
];

export default function Home() {
  const controls = useAnimation();
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  // Animations
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-pink-600/20" />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, -90, 0],
            }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-500/10 to-transparent rounded-full blur-3xl"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-6">
              Produtividade
              <br />
              Gamificada
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12">
              Transforme suas tarefas em uma jornada épica. Ganhe experiência,
              suba de nível e desbloqueie conquistas enquanto alcança seus
              objetivos.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/auth/register"
                  className="inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium text-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-indigo-500/25"
                >
                  Começar Agora
                  <RocketLaunchIcon className="ml-2 h-5 w-5" />
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <button className="inline-flex items-center px-8 py-4 rounded-full bg-white/10 backdrop-blur-sm text-white font-medium text-lg hover:bg-white/20 transition-all duration-200">
                  Ver Demo
                  <SparklesIcon className="ml-2 h-5 w-5" />
                </button>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <ChevronRightIcon className="h-8 w-8 rotate-90 text-gray-400" />
        </motion.div>
      </div>

      {/* Features Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={controls}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="relative group"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-300`}
                />
                <div className="relative bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
                  <div className="mb-6">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-gray-400 mb-6">{feature.description}</p>
                  <ul className="space-y-3">
                    {feature.benefits.map((benefit, i) => (
                      <li
                        key={i}
                        className="flex items-center text-sm text-gray-300"
                      >
                        <CheckCircleIcon className="h-5 w-5 text-indigo-400 mr-2" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                  {stat.value}
                </div>
                <div className="mt-2 text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Before/After Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-6">
              Antes vs Depois
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Veja a diferença que nossa plataforma pode fazer na sua
              produtividade diária
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50"
            >
              <h3 className="text-2xl font-semibold text-red-400 mb-6">
                Sem TaskMaster
              </h3>
              <ul className="space-y-4">
                {[
                  "Tarefas esquecidas ou atrasadas",
                  "Procrastinação frequente",
                  "Falta de motivação",
                  "Sem visibilidade do progresso",
                  "Dificuldade em manter rotina",
                  "Tempo mal aproveitado",
                ].map((item, i) => (
                  <li key={i} className="flex items-center text-gray-400">
                    <XMarkIcon className="h-5 w-5 text-red-400 mr-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50"
            >
              <h3 className="text-2xl font-semibold text-green-400 mb-6">
                Com TaskMaster
              </h3>
              <ul className="space-y-4">
                {[
                  "Sistema de recompensas gamificado",
                  "Progresso visual e motivador",
                  "IA para otimização de tempo",
                  "Lembretes inteligentes",
                  "Estatísticas detalhadas",
                  "Conquistas desbloqueáveis",
                ].map((item, i) => (
                  <li key={i} className="flex items-center text-gray-400">
                    <CheckCircleIcon className="h-5 w-5 text-green-400 mr-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-6">
              Histórias de Sucesso
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Descubra como nossos usuários transformaram sua produtividade
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50"
              >
                <div className="flex items-center gap-4 mb-6">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h4 className="font-semibold text-lg">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-6">{testimonial.content}</p>
                <div className="grid grid-cols-3 gap-4 text-center pt-6 border-t border-gray-700">
                  <div>
                    <div className="text-xl font-bold text-indigo-400">
                      {testimonial.stats.tasks}
                    </div>
                    <div className="text-xs text-gray-400">Tarefas</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-purple-400">
                      {testimonial.stats.streak}
                    </div>
                    <div className="text-xs text-gray-400">Dias Seguidos</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-pink-400">
                      {testimonial.stats.hours}h
                    </div>
                    <div className="text-xs text-gray-400">Economizadas</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-6">
              Planos para Todos
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Escolha o plano ideal para suas necessidades
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Básico",
                price: "Grátis",
                features: [
                  "Até 5 tarefas diárias",
                  "Cronograma básico",
                  "Lembretes simples",
                  "Conquistas iniciais",
                ],
                color: "from-gray-500 to-gray-600",
              },
              {
                name: "Pro",
                price: "R$ 19,90/mês",
                features: [
                  "Tarefas ilimitadas",
                  "IA para otimização",
                  "Análise avançada",
                  "Todas as conquistas",
                  "Suporte prioritário",
                ],
                color: "from-indigo-500 to-purple-600",
                popular: true,
              },
              {
                name: "Time",
                price: "R$ 49,90/mês",
                features: [
                  "Tudo do Pro",
                  "Até 5 membros",
                  "Dashboards de equipe",
                  "Metas compartilhadas",
                  "Integração personalizada",
                ],
                color: "from-purple-500 to-pink-600",
              },
            ].map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 ${
                  plan.popular ? "ring-2 ring-purple-500" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm">
                      Mais Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                  <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                    {plan.price}
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-gray-300">
                      <CheckCircleIcon className="h-5 w-5 text-indigo-400 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 px-4 rounded-xl bg-gradient-to-r ${plan.color} text-white font-medium hover:opacity-90 transition-opacity`}
                >
                  <Link href="/auth/register" className="">
                    Começar
                  </Link>
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Pronto para Transformar sua Produtividade?
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Junte-se a milhares de usuários que já estão alcançando mais com
              menos esforço. Comece sua jornada hoje mesmo!
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Link
                href="/auth/register"
                className="inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium text-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-indigo-500/25"
              >
                Começar Gratuitamente
                <RocketLaunchIcon className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
