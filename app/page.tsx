"use client"
import { useState } from "react";

export default function Home() {

  const recipeCard = 'bg-gradient-to-br from-[#3a3a3a] to-gray-[#2d2d2d] rounded-xl overflow-hidden transition-all duration-300 ease-out border border-gray-600 hover:-translate-y-1 hover:shadow-2xl';
  const recipeImage = 'w-full h-50 bg-gradient-to-br from-[#3b82f6] to-[#64748b] flex items-center justify-center text-9xl text-white';
  const recipeInfo = 'p-6';
  const recipeInfoH3 = 'text-[#3b82f6] mb-4 text-xl font-bold';
  const ingredients = 'mb-6';
  const ingredientsH4 = 'text-gray-300 mb-2 text-base font-bold';
  const ingredientsul = 'list-none pl-0';
  const ingredientli = "text-[#b0b0b0] mb-[0.3rem] pl-4 relative before:content-['•'] before:text-[#3b82f6] before:absolute before:left-0";
  const addToList = 'bg-gradient-to-br from-[#3b82f6] to-[#64748b] text-white border-none py-3 px-6 rounded-full cursor-pointer font-bold transition-all duration-300 ease-out w-full hover:-translate-y-0.5 hover:bg-gradient-to-br hover:blue-blue-600 hover:to-blue-700';
  const shoppingItem = 'bg-[#3a3a3a] p-4 mb-2 rounded-lg border-l-4 border-l-[#3b82f6] transition-all duration-300 ease-out hover:bg-[#404040] hover:-translate-x-[5px]'

  const [empty] = useState(true);

  return (
    <div className="max-w-6xl mx-auto p-8 grid grid-cols-[1fr_350px] gap-8 max-md:grid-cols-1 max-md:gap-4">
      <main className="flex flex-col gap-8">
        {/* MAIN CONTAINER */}
        <section className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-12 text-center shadow-xl rounded-lg max-md:p-8 max-sm:p-6">
          <h1 className="welcome-title">
            Planifier Vos Repas avec IA
          </h1>

          <p className="text-xl mb-8 opacity-90 max-w-[600px] ml-auto mr-auto max-sm:text-base">
            Decouvez une nouvelle facon de planifier vos repas grace a notre Intelligence Artificielle.
            Obtenez des suggestions personnalisees, optimisez vos courses et savourez chaque repas.
          </p>

          <button className="bg-gradient-to-br from-[#3b82f6] to-[#64748b] text-white px-8 py-4 border-none rounded-full text-lg font-bold cursor-pointer transition-all duration-300 ease-in-out shadow-xs hover:-translate-y-0.5 hover:shadow-lg shadow-blue-900">
            Commencer
          </button>
        </section>

        {/* RECEIPE SECTION */}
        <section className="bg-[#2a2a2a] p-8 rounded-2xl shadow-xl">
          <h2 className="text-[#3b82f6] mb-6 text-3xl">
            Suggestions de recettes.
          </h2>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 max-md:grid-cols-1">
            <div className={recipeCard}>
              <div className={recipeImage}>
                🥗
              </div>
              <div className={recipeInfo}>
                <h3 className={recipeInfoH3}>Salade Mediterraneenne</h3>
                <div className={ingredients}>
                  <h4 className={ingredientsH4}> Ingredients: </h4>
                  <ul className={ingredientsul}>
                    <li className={ingredientli}>Tomates Cerises</li>
                    <li className={ingredientli}>Concombre</li>
                    <li className={ingredientli}>Olives noires</li>
                    <li className={ingredientli}>Fetas</li>
                    <li className={ingredientli}>Huile d olive</li>
                  </ul>
                </div>
                <button className={addToList}>Ajouter a la liste</button>
              </div >
            </div >

            <div className={recipeCard}>
              <div className={recipeImage}>
                🥗
              </div>
              <div className={recipeInfo}>
                <h3 className={recipeInfoH3}>Pates au Pesto</h3>
                <div className={ingredients}>
                  <h4 className={ingredientsH4}> Ingredients: </h4>
                  <ul className={ingredientsul}>
                    <li className={ingredientli}>Pâtes pennes</li>
                    <li className={ingredientli}>Basilic frais</li>
                    <li className={ingredientli}>Pignons de pin</li>
                    <li className={ingredientli}>Parmesan</li>
                    <li className={ingredientli}>Ail</li>
                  </ul>
                </div>
                <button className={addToList}>Ajouter a la liste</button>
              </div>
            </div>

            <div className={recipeCard}>
              <div className={recipeImage}>
                🥗
              </div>
              <div className={recipeInfo}>
                <h3 className={recipeInfoH3}>Saumon Grillé</h3>
                <div className={ingredients}>
                  <h4 className={ingredientsH4}> Ingredients: </h4>
                  <ul className={ingredientsul}>
                    <li className={ingredientli}>Filet de saumon</li>
                    <li className={ingredientli}>Citron</li>
                    <li className={ingredientli}>Herbes de Provenc</li>
                    <li className={ingredientli}>Brocolis</li>
                    <li className={ingredientli}>Huile d olive</li>
                  </ul>
                </div>
                <button className={addToList}>Ajouter a la liste</button>
              </div>
            </div>
          </div >
        </section >
      </main >

      <aside className="bg-[#2a2a2a] p-8 rounded-2xl shadow-xl h-fit sticky top-[120px] max-md:static">
        <h2 className="text-[#3b82f6] mb-6 text-2xl font-bold flex items-center gap-2">
          <span className="text-2xl">🛒</span>
          Liste de courses
        </h2>

        {
          empty ? (
            <div className="text-center text-[#888] italic p-8">
              Votre liste de courses est vide.<br />
              Ajoutez des recettes pour commencer!
            </div>
          ) : (
            <ul className="list-none">
              <li className={shoppingItem}>Tomates Cerises</li>
              <li className={shoppingItem}>Concombres</li>
              <li className={shoppingItem}>Olives noires</li>
            </ul>
          )
        }
      </aside>
    </div >
  );
}
