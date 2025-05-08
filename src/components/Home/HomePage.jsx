import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import chatIllustration from "../../assets/chat-illustration.svg";
import backgroundImage from "../../assets/wow.png";
import { AuthContext } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

function HomePage() {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  // Scroll observer to track active sections
  useEffect(() => {
    setIsVisible(true);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  // Redirect authenticated users to the chat page
  useEffect(() => {
    if (currentUser) {
      navigate("/chat");
    }
  }, [currentUser, navigate]);

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section
        id="home"
        className="relative min-h-screen flex items-center pt-24 overflow-hidden snap-start"
        style={{
          background: `
            linear-gradient(135deg, 
              rgba(219, 234, 254, 0.95) 0%, 
              rgba(255, 255, 255, 0.9) 100%),
            url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.2, scale: 1 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-200 blur-3xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.2, scale: 1 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 1,
            }}
            className="absolute top-1/2 -left-40 w-96 h-96 rounded-full bg-indigo-200 blur-3xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.15, scale: 1 }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 2,
            }}
            className="absolute bottom-20 right-1/4 w-64 h-64 rounded-full bg-purple-200 blur-3xl"
          />
        </div>

        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-16">
            <motion.div
              className="flex-1 text-center lg:text-left"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.div
                className="backdrop-blur-sm bg-white/90 p-12 rounded-3xl border border-gray-100 shadow-2xl"
                whileHover={{
                  y: -5,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-6"
                >
                  ✨ Découvrez l'avenir de la communication
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="text-5xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight tracking-tight"
                >
                  Communication
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                    Simplifiée.
                  </span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="text-xl text-gray-600 mb-10 font-medium leading-relaxed max-w-2xl"
                >
                  Une plateforme de messagerie professionnelle conçue pour les
                  équipes modernes.{" "}
                  <span className="text-blue-600 font-semibold">Sécurisée</span>
                  ,<span className="text-blue-600 font-semibold"> rapide</span>{" "}
                  et
                  <span className="text-blue-600 font-semibold">
                    {" "}
                    intuitive
                  </span>
                  .
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1 }}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 justify-center lg:justify-start w-full"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Link
                      to="/register"
                      className="group btn bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 text-lg px-8 py-3 sm:px-10 sm:py-4 rounded-xl shadow-xl transition-all duration-300 inline-flex items-center justify-center whitespace-nowrap min-w-[220px]"
                    >
                      Démarrer gratuitement
                      <motion.span
                        className="inline-block ml-2"
                        animate={{ x: [0, 5, 0] }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          repeatType: "loop",
                          ease: "easeInOut",
                          repeatDelay: 1,
                        }}
                      >
                        →
                      </motion.span>
                    </Link>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Link
                      to="/login"
                      className="btn bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 text-lg px-8 py-3 sm:px-10 sm:py-4 rounded-xl shadow-xl transition-all duration-300 whitespace-nowrap min-w-[220px] text-center"
                    >
                      Se connecter
                    </Link>
                  </motion.div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                  className="mt-10 flex items-center gap-6 justify-center lg:justify-start text-sm text-gray-500"
                >
                  <div className="flex items-center">
                    <motion.svg
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="w-5 h-5 text-green-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </motion.svg>
                    Installation gratuite
                  </div>
                  <div className="flex items-center">
                    <motion.svg
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="w-5 h-5 text-green-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </motion.svg>
                    Support 24/7
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex-1"
            >
              <motion.img
                src={chatIllustration}
                alt="Chat Illustration"
                className="w-full max-w-lg mx-auto drop-shadow-2xl"
                whileHover={{ scale: 1.05 }}
                animate={{
                  y: [-15, 15],
                  rotate: [-1, 1],
                }}
                transition={{
                  y: {
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 3,
                    ease: "easeInOut",
                  },
                  rotate: {
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 3,
                    ease: "easeInOut",
                  },
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="py-32 bg-white snap-start min-h-screen flex items-center"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <h2 className="text-4xl font-bold text-center text-gray-900 mb-8">
                Pourquoi choisir
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                  {" "}
                  ChatWithMe{" "}
                </span>
                ?
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12 mt-16">
              <div className="space-y-12">
                {[
                  {
                    num: "01",
                    title: "Communication simplifiée",
                    description:
                      "Notre plateforme est conçue pour rendre la communication d'équipe aussi simple et efficace que possible, avec une interface intuitive et des fonctionnalités puissantes.",
                  },
                  {
                    num: "02",
                    title: "Haute performance",
                    description:
                      "Profitez d'une messagerie en temps réel ultra-rapide et fiable, conçue pour gérer vos conversations sans latence.",
                  },
                ].map((item, index) => (
                  <FeatureItem
                    key={index}
                    number={item.num}
                    title={item.title}
                    description={item.description}
                    delay={0.2 + index * 0.2}
                  />
                ))}
              </div>
              <div className="space-y-12">
                {[
                  {
                    num: "03",
                    title: "Sécurité maximale",
                    description:
                      "Vos données sont notre priorité. Nous utilisons les dernières technologies de cryptage pour protéger vos conversations.",
                  },
                  {
                    num: "04",
                    title: "Support réactif",
                    description:
                      "Notre équipe de support est disponible 24/7 pour vous aider et répondre à toutes vos questions.",
                  },
                ].map((item, index) => (
                  <FeatureItem
                    key={index}
                    number={item.num}
                    title={item.title}
                    description={item.description}
                    delay={0.6 + index * 0.2}
                  />
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true, amount: 0.3 }}
              className="mt-16 text-center"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { value: "99.9%", label: "Temps de disponibilité" },
                  { value: "50K+", label: "Utilisateurs actifs" },
                  { value: "24/7", label: "Support client" },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className="p-6 rounded-xl bg-blue-50 shadow-lg border border-blue-100"
                  >
                    <CountUp
                      value={stat.value}
                      className="text-4xl font-bold text-blue-600 mb-2"
                      delay={0.8 + index * 0.2}
                    />
                    <div className="text-gray-600">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="bg-gray-50 py-32 snap-start min-h-screen flex items-center"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-20">
              Fonctionnalités
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                {" "}
                avancées
              </span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: "💬",
                title: "Messagerie en temps réel",
                description:
                  "Communication instantanée avec une interface intuitive et des fonctionnalités avancées.",
              },
              {
                icon: "👥",
                title: "Collaboration d'équipe",
                description:
                  "Créez des espaces de travail dédiés pour vos équipes et vos projets.",
              },
              {
                icon: "🔒",
                title: "Sécurité renforcée",
                description:
                  "Chiffrement de bout en bout et authentification à deux facteurs.",
              },
            ].map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={0.2 + index * 0.2}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.3 }}
        className="bg-gradient-to-b from-gray-50 to-white py-32"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ scale: 0.95 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-16 text-white shadow-2xl relative overflow-hidden"
          >
            {/* Animated background elements */}
            <motion.div
              className="absolute top-0 left-0 w-full h-full opacity-10"
              animate={{
                backgroundPosition: ["0% 0%", "100% 100%"],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                repeatType: "mirror",
              }}
              style={{
                backgroundImage:
                  'url(\'data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" fill="%23FFFFFF" fill-opacity="1" fill-rule="evenodd"/%3E%3C/svg%3E\')',
                backgroundSize: "30px 30px",
              }}
            />

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-5xl font-bold mb-8 relative"
            >
              Prêt à transformer votre communication ?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl mb-12 text-white/90 max-w-2xl mx-auto relative"
            >
              Rejoignez les milliers d'équipes qui ont déjà adopté ChatWithMe
              pour leur communication professionnelle.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="relative"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link
                  to="/register"
                  className="group btn bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 text-lg px-8 py-3 sm:px-10 sm:py-4 rounded-xl shadow-xl transition-all duration-300 inline-flex items-center justify-center whitespace-nowrap min-w-[220px]"
                >
                  Démarrer gratuitement
                  <motion.span
                    className="inline-block ml-2"
                    animate={{ x: [0, 5, 0] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      repeatType: "loop",
                      ease: "easeInOut",
                      repeatDelay: 1,
                    }}
                  >
                    →
                  </motion.span>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="bg-gradient-to-b from-white to-blue-50 pt-16 pb-8 border-t border-blue-100"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center mb-6">
                <img
                  src="/src/assets/chatwithme-logo.png"
                  alt="ChatWithMe Logo"
                  className="h-10 w-auto scale-250" // larger visually without pushing height
                />
                <span className="text-xl  font-bold text-blue-600 ml-2">
                  ChatWithMe
                </span>
              </div>
              <p className="text-gray-600 mb-6">
                Une plateforme de messagerie professionnelle conçue pour les
                équipes modernes.
              </p>
              <div className="flex space-x-4">
                {["facebook", "twitter", "linkedin"].map((social, index) => (
                  <motion.a
                    key={social}
                    href="#"
                    whileHover={{ y: -5, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md border border-gray-100 text-gray-600 hover:text-blue-600 hover:border-blue-300 transition-colors"
                  >
                    {social === "facebook" && (
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fillRule="evenodd"
                          d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    {social === "twitter" && (
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    )}
                    {social === "linkedin" && (
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
                      </svg>
                    )}
                  </motion.a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Produit
              </h3>
              <ul className="space-y-3">
                {["Fonctionnalités", "Solutions", "Tarification", "FAQ"].map(
                  (item) => (
                    <li key={item}>
                      <motion.a
                        href="#"
                        className="text-gray-600 hover:text-blue-600 transition-colors"
                        whileHover={{ x: 5 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        }}
                      >
                        {item}
                      </motion.a>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Ressources
              </h3>
              <ul className="space-y-3">
                {["Blog", "Documentation", "Guides", "API"].map((item) => (
                  <li key={item}>
                    <motion.a
                      href="#"
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                      whileHover={{ x: 5 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      {item}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Entreprise
              </h3>
              <ul className="space-y-3">
                {["À propos", "Équipe", "Carrières", "Contact"].map((item) => (
                  <li key={item}>
                    <motion.a
                      href="#"
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                      whileHover={{ x: 5 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      {item}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-blue-100 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-600 mb-4 md:mb-0">
              © {new Date().getFullYear()} ChatWithMe. Tous droits réservés.
            </div>
            <div className="flex space-x-6 text-sm">
              <a
                href="#"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Politique de confidentialité
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Conditions d'utilisation
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Mentions légales
              </a>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}

// Special Component for count-up animation
const CountUp = ({ value, className, delay = 0 }) => {
  const [count, setCount] = useState(0);
  const isNumeric = /^\d+$/.test(value.replace(/[^\d]/g, ""));
  const numericValue = isNumeric ? parseInt(value.replace(/[^\d]/g, "")) : 0;
  const finalValue = value;

  useEffect(() => {
    let startTime;
    let animationFrame;
    const duration = 2000; // 2 seconds

    const updateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      if (isNumeric) {
        setCount(Math.floor(progress * numericValue));
      } else {
        setCount(progress * 100);
      }

      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateCount);
      }
    };

    const timeoutId = setTimeout(() => {
      animationFrame = requestAnimationFrame(updateCount);
    }, delay * 1000);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(animationFrame);
    };
  }, [numericValue, delay, isNumeric]);

  return <div className={className}>{isNumeric ? count : finalValue}</div>;
};

// Special Component for feature item
const FeatureItem = ({ number, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    viewport={{ once: true, amount: 0.3 }}
    className="flex items-start space-x-4"
  >
    <div className="text-3xl font-bold text-blue-600">{number}</div>
    <div>
      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      <p className="text-gray-600 mt-2">{description}</p>
    </div>
  </motion.div>
);

// Special Component for feature card
const FeatureCard = ({ icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    viewport={{ once: true, amount: 0.3 }}
    className="bg-white rounded-lg shadow-lg p-6 text-center"
  >
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

export default HomePage;
