
export default function Home() {

  const recipeCard = 'bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl overflow-hidden transition-all duration-300 ease-out border border-gray-600 hover:-translate-y-1 hover:shadow-2xl';
  const recipeImage = 'w-full h-50 bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-9xl text-white';
  const recipeInfo = 'p-6';
  const recipeInfoH3 = 'text-[#7cb342] mb-4 text-xl';
  const ingredients = 'mb-6'

  return (
    <div className="max-w-6xl mx-auto p-8 grid grid-cols-[1fr_350px] gap-8">
      <main className="flex flex-col gap-8">
        {/* MAIN CONTAINER */}
        <section className="bg-gradient-to-br from-[#2d5016] to-[#1a3009] p-12 text-center shadow-xl">
          <h1 className="welcome-title">
            Planifier Vos Repas avec IA
          </h1>

          <p className="text-2xl mb-8 opacity-90 max-w-[600px] ml-auto mr-auto">
            Decouvez une nouvelle facon de planifier vos repas grace a notre Intelligence Artificielle.
            Obtenez des suggestions personnalisees, optimisez vos courses et savourez chaque repas.
          </p>

          <button className="bg-gradient-to-br from-[#7cb342] to-[#558b2f] text-white px-8 py-4 border-none rounded-full text-lg font-bold cursor-pointer transition-all duration-300 ease-in-out shadow-xs hover:-translate-y-0.5 hover:shadow-lg shadow-amber-500">
            Commencer
          </button>
        </section>

        {/* RECEIPE SECTION */}
        <section className="bg-[#2a2a2a] p-8 rounded-2xl shadow-xl">
          <h2 className="text-[#7cb342] mb-6 text-3xl">
            Suggestions de recettes.
          </h2>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
            <div className={recipeCard}>
              <div className={recipeImage}>
                🥗
              </div>
              <div className={recipeInfo}>
                <h3 className={recipeInfoH3}>Salade Mediterraneenne</h3>
                <div className={ingredients}>
                  <h4>Ingredients: </h4>
                  <ul>
                    <li>Tomates Cerises</li>
                    <li>Concombre</li>
                    <li>Olives noires</li>
                    <li>Fetas</li>
                    <li>Huile d olive</li>
                  </ul>
                </div>
                <button>Ajouter a la liste</button>
              </div>
            </div>

            <div className={recipeCard}>
              <div className={recipeImage}>
                🥗
              </div>
              <div className={recipeInfo}>
                <h3 className={recipeInfoH3}>Pates au Pesto</h3>
                <div className={ingredients}>
                  <h4>Ingredients: </h4>
                  <ul>
                    <li>Pâtes pennes</li>
                    <li>Basilic frais</li>
                    <li>Pignons de pin</li>
                    <li>Parmesan</li>
                    <li>Ail</li>
                  </ul>
                </div>
                <button>Ajouter a la liste</button>
              </div>
            </div>

            <div className={recipeCard}>
              <div className={recipeImage}>
                🥗
              </div>
              <div className={recipeInfo}>
                <h3 className={recipeInfoH3}>Saumon Grillé</h3>
                <div className={ingredients}>
                  <h4>Ingredients: </h4>
                  <ul>
                    <li>Filet de saumon</li>
                    <li>Citron</li>
                    <li>Herbes de Provenc</li>
                    <li>Brocolis</li>
                    <li>Huile d olive</li>
                  </ul>
                </div>
                <button>Ajouter a la liste</button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <aside>
        <h2>
          <span>🛒</span>
          Liste de courses
        </h2>
        <ul>
          <li>Tomates Cerises</li>
          <li>Concombres</li>
          <li>Olives noires</li>
        </ul>

        <div>
          Votre liste de courses est vide.<br />
          Ajoutez des recettes pour commencer!
        </div>
      </aside>
    </div>
  );
}
