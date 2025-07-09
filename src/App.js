import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useParams, Outlet } from 'react-router-dom';
import { Camera, Clock, Users, ShoppingCart, ChevronDown, ChevronUp, CheckCircle, Leaf, AlertTriangle } from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';


// --- Reusable UI Components ---

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-green-700 hover:text-green-600">
          The Gut-Friendly Kitchen
        </Link>
        <div>
          <Link to="/" className="text-gray-600 hover:text-green-600 mx-3">Home</Link>
        </div>
      </nav>
    </header>
  );
}

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-12">
      <div className="container mx-auto px-6 py-4 text-center">
        <p>&copy; 2025 The Gut-Friendly Kitchen. Eat well, feel well.</p>
      </div>
    </footer>
  );
}

const Layout = () => {
  return (
    <div className="bg-green-50/50 min-h-screen font-sans flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}

const RecipeCard = ({ recipe }) => {
  return (
    <Link to={`/recipe/${recipe.id}`} className="block bg-white rounded-2xl shadow-lg overflow-hidden group">
      <div className="overflow-hidden">
        <img className="h-48 w-full object-cover group-hover:scale-110 transition-transform duration-300" src={recipe.imageUrl} alt={recipe.title} />
      </div>
      <div className="p-4">
        <p className="text-sm text-green-600 font-semibold flex items-center"><Leaf className="h-4 w-4 mr-1.5"/>{recipe.category}</p>
        <h3 className="mt-1 font-bold text-gray-900 truncate">{recipe.title}</h3>
        <div className="flex items-center mt-2 text-sm text-gray-500">
          <Clock className="h-4 w-4 mr-1"/>
          <span>{recipe.cookTime} mins</span>
        </div>
      </div>
    </Link>
  );
}

// --- Components for the Recipe Page ---
const RecipeHeader = ({ title, category, description, chef, imageUrl }) => ( <div className="md:flex"><div className="md:flex-shrink-0"><img className="h-64 w-full object-cover md:h-full md:w-64" src={imageUrl} alt={title} /></div><div className="p-8"><div className="uppercase tracking-wide text-sm text-green-600 font-semibold">{category}</div><h1 className="mt-2 text-3xl md:text-4xl leading-tight font-extrabold text-gray-900">{title}</h1><p className="mt-4 text-gray-600">{description}</p><div className="mt-6 flex items-center"><img className="h-12 w-12 rounded-full object-cover" src={chef.avatarUrl} alt={chef.name} /><div className="ml-4"><p className="font-semibold text-gray-800">By {chef.name}</p><p className="text-gray-500 text-sm">Published on {chef.publishedDate}</p></div></div></div></div>);
const RecipeMetaBar = ({ meta }) => ( <div className="bg-gray-100 border-t border-b border-gray-200 px-8 py-4 flex flex-wrap justify-around text-center"><div className="flex items-center m-2"><Clock className="h-6 w-6 text-green-600 mr-2" /><div><p className="font-bold text-gray-800">Prep Time</p><p className="text-gray-600">{meta.prepTime} mins</p></div></div><div className="flex items-center m-2"><Camera className="h-6 w-6 text-green-600 mr-2" /><div><p className="font-bold text-gray-800">Cook Time</p><p className="text-gray-600">{meta.cookTime} mins</p></div></div><div className="flex items-center m-2"><Users className="h-6 w-6 text-green-600 mr-2" /><div><p className="font-bold text-gray-800">Servings</p><p className="text-gray-600">{meta.servings} serving</p></div></div></div>);
const IngredientsPanel = ({ ingredients }) => { const ShopLink = ({ ingredientId }) => ( <a href="#" onClick={(e) => { e.preventDefault(); alert(`Shop for ${ingredientId}`); }} className="ml-4 text-sm font-semibold text-green-700 hover:text-green-600 transition-colors flex-shrink-0">Shop</a>); const IngredientItem = ({ item }) => ( <li className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0"><div className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" /><div><span className="font-medium text-gray-800">{item.name}</span>{item.notes && <span className="text-gray-500 italic ml-2">({item.notes})</span>}</div></div><ShopLink ingredientId={item.id} /></li>); const IngredientGroup = ({ group }) => ( <div className="mb-4 last:mb-0"><h4 className="font-bold text-gray-700 mb-2">{group.group}</h4><ul>{group.items.map((item) => <IngredientItem key={item.id} item={item} />)}</ul></div>); return ( <div className="lg:col-span-1"><h3 className="text-2xl font-bold text-gray-900 flex items-center mb-4"><ShoppingCart className="h-7 w-7 text-green-700 mr-3" />Ingredients</h3><div className="bg-gray-50 p-4 rounded-lg border border-gray-200">{ingredients.map((group, index) => <IngredientGroup key={index} group={group} />)}</div></div>);};
const InstructionsPanel = ({ instructions }) => { const InstructionStep = ({ step, index }) => ( <li className="flex"><span className="flex-shrink-0 bg-green-600 text-white font-bold rounded-full h-8 w-8 flex items-center justify-center mr-4">{index + 1}</span><p className="text-gray-700 leading-relaxed">{step}</p></li>); return ( <div><h3 className="text-2xl font-bold text-gray-900 mb-4">Instructions</h3><ol className="space-y-6">{instructions.map((step, index) => <InstructionStep key={index} step={step} index={index} />)}</ol></div>);};
const InsightsPanel = ({ insights }) => { const InsightAccordionItem = ({ insight }) => { const [isOpen, setIsOpen] = useState(false); return ( <div className="border-b border-gray-200"><button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center py-4 text-left"><h4 className="font-semibold text-lg text-gray-800">{insight.title}</h4>{isOpen ? <ChevronUp className="h-6 w-6 text-gray-500" /> : <ChevronDown className="h-6 w-6 text-gray-500" />}</button>{isOpen && ( <div className="pb-4 pr-6 text-gray-600"><p>{insight.content}</p></div>)}</div>); }; return ( <div className="mt-12"><h3 className="text-2xl font-bold text-gray-900 flex items-center mb-4"><Leaf className="h-7 w-7 text-green-500 mr-3" />Ingredient Insights</h3><div className="space-y-2">{insights.map((insight) => <InsightAccordionItem key={insight.id} insight={insight} />)}</div></div>);};

// --- Page-level Components ---
const HomePage = () => {
    const [recipes, setRecipes] = useState([]);
    const [error, setError] = useState(null);
    useEffect(() => { fetch(`${API_BASE_URL}/api/recipes`).then(res => { if (!res.ok) throw new Error('Failed to fetch recipes.'); return res.json(); }).then(setRecipes).catch(err => setError(err.message)); }, []);
    return ( <div><h1 className="text-4xl font-extrabold text-gray-900 mb-2">Welcome to the Gut-Friendly Kitchen</h1><p className="text-lg text-gray-600 mb-6">Delicious recipes designed to be gentle on your digestive system.</p>{error && <p className="text-red-500 font-semibold">{error}</p>}<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">{recipes.map(recipe => <RecipeCard key={recipe.id} recipe={recipe} />)}</div></div>);
};
const RecipePage = () => {
  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => { setRecipe(null); setError(null); fetch(`${API_BASE_URL}/api/recipes/${recipeId}`).then(response => { if (!response.ok) throw new Error('Network response was not ok.'); return response.json(); }).then(data => setRecipe(data)).catch(error => { console.error("Fetch error:", error); setError(error.message); }); }, [recipeId]);
  if (error) return <div className="text-center p-12 bg-red-50 rounded-lg"><AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" /><h2 className="text-2xl font-semibold text-red-800">Recipe not found or server error.</h2></div>;
  if (!recipe) return <div className="text-center p-12"><h2 className="text-2xl font-semibold text-gray-700">Loading recipe...</h2></div>;
  return ( <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden"><RecipeHeader title={recipe.title} category={recipe.category} description={recipe.description} chef={recipe.chef} imageUrl={recipe.imageUrl} /><RecipeMetaBar meta={recipe.meta} /><div className="p-8"><div className="grid grid-cols-1 lg:grid-cols-3 gap-8"><IngredientsPanel ingredients={recipe.ingredients} /><div className="lg:col-span-2"><InstructionsPanel instructions={recipe.instructions} />{recipe.insights && recipe.insights.length > 0 && <InsightsPanel insights={recipe.insights} />}</div></div></div></div>);
};

// --- Main App Component (Routing) ---
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="recipe/:recipeId" element={<RecipePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
