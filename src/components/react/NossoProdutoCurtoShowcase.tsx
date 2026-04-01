import { motion } from 'motion/react';
import { Warehouse, Truck, Package } from 'lucide-react';
import areiaFinaImg from '../../../images/areia-fina.png';
import areiaMediaImg from '../../../images/areia-media.png';
import areiaGrossaImg from '../../../images/areia-grossa-produtos.png';

const features = [
  {
    icon: Warehouse,
    title: 'Areia Fina',
    description: 'Ideal para reboco, argamassa e acabamentos internos. Granulometria uniforme e baixo teor de impurezas.',
    image: areiaFinaImg,
  },
  {
    icon: Truck,
    title: 'Areia Média',
    description: 'Versátil para concreto convencional, assentamento de blocos e pisos.',
    image: areiaMediaImg,
  },
  {
    icon: Package,
    title: 'Areia Grossa',
    description: 'Alta resistência para fundações, concreto armado e obras estruturais.',
    image: areiaGrossaImg,
  },
];

export default function NossoProdutoCurtoShowcase() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {features.map((feature, index) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="group cursor-pointer"
        >
          <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
            <div className="relative h-64 overflow-hidden">
              <motion.img
                src={feature.image.src}
                alt={feature.title}
                className="w-full h-full object-cover"
                loading="lazy"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/50 to-transparent opacity-60" />

              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
                className="absolute top-4 right-4 w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-lg"
              >
                <feature.icon className="w-6 h-6 text-[#393e92]" />
              </motion.div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-200 opacity-90">{feature.description}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
