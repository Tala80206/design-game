import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";

const materials = [
  "Стара футболка",
  "Скляні пляшки",
  "Пластикові кришки",
  "Газети та журнали",
  "Старі джинси",
  "Зношені книги",
  "Вінілові платівки",
  "Дерев'яні піддони",
  "Зламані меблі",
  "Компакт-диски",
];

const tasks = [
  "Створи аксесуар із цього матеріалу",
  "Розроби екологічний продукт для дому",
  "Зроби арт-об'єкт або декоративний елемент",
  "Придумай функціональний предмет",
  "Поєднай два різні матеріали у виробі",
  "Розроби продукт для соціального використання",
  "Зроби практичний виріб для повторного використання",
];

export default function UpcycleGame() {
  const [material, setMaterial] = useState(null);
  const [task, setTask] = useState(null);
  const [idea, setIdea] = useState("");
  const [generatedImage, setGeneratedImage] = useState(null);
  const [aiProvider, setAiProvider] = useState("leonardo");

  const generateTask = () => {
    setMaterial(materials[Math.floor(Math.random() * materials.length)]);
    setTask(tasks[Math.floor(Math.random() * tasks.length)]);
    setIdea("");
    setGeneratedImage(null);
  };

  const handleGenerateAIImage = async () => {
    const prompt = `Creative upcycling design using ${material}, transformed into a ${task}`;
    let imageUrl = "https://via.placeholder.com/300x200?text=AI+Generated+Idea";

    try {
      if (aiProvider === "leonardo") {
        const response = await axios.get(`https://api.leonardo.ai/generate?prompt=${encodeURIComponent(prompt)}`);
        imageUrl = response.data.imageUrl;
      } else if (aiProvider === "ideogram") {
        const response = await axios.get(`https://api.ideogram.ai/generate?prompt=${encodeURIComponent(prompt)}`);
        imageUrl = response.data.imageUrl;
      }
      setGeneratedImage(imageUrl);
    } catch (error) {
      console.error("Помилка генерації зображення: ", error);
    }
  };

  return (
    <div className="bg-green-100 min-h-screen flex flex-col items-center p-10 text-center" style={{ backgroundImage: "url(/mnt/data/A_minimalistic_background_image_for_an_upcycling-t.png)", backgroundSize: "cover" }}>
      <motion.h1 className="text-4xl font-bold text-green-800 mb-6" animate={{ scale: [1, 1.1, 1] }}>
        Upcycle Challenge
      </motion.h1>
      
      <motion.div className="mb-6" whileHover={{ scale: 1.1 }}>
        <Button onClick={generateTask} className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md">
          Отримати завдання
        </Button>
      </motion.div>
      
      {material && task && (
        <Card className="w-96 bg-white shadow-lg rounded-xl p-5">
          <CardContent>
            <h2 className="text-xl font-semibold text-green-700">Матеріал: {material}</h2>
            <p className="text-md text-gray-700 mt-2">{task}</p>
          </CardContent>
        </Card>
      )}
      
      {material && (
        <div className="mt-6 w-96">
          <textarea
            className="w-full p-3 border rounded-md"
            placeholder="Опиши свою ідею тут..."
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
          />
          <motion.div className="mt-4" whileHover={{ scale: 1.1 }}>
            <Button onClick={handleGenerateAIImage} className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md">
              Згенерувати ідею через AI
            </Button>
          </motion.div>
          <div className="mt-4">
            <label className="text-green-700 font-semibold">Виберіть AI:</label>
            <select className="ml-2 p-2 border rounded-md" value={aiProvider} onChange={(e) => setAiProvider(e.target.value)}>
              <option value="leonardo">Leonardo.Ai</option>
              <option value="ideogram">Ideogram</option>
            </select>
          </div>
        </div>
      )}
      
      {generatedImage && (
        <div className="mt-6">
          <h3 className="text-lg text-green-700 font-semibold">Згенероване зображення:</h3>
          <img src={generatedImage} alt="AI Generated Idea" className="rounded-lg shadow-md mt-2" />
        </div>
      )}
    </div>
  );
}
