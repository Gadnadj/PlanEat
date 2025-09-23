export const getIngredientCategory = (ingredientName: string): string => {
  const name = ingredientName.toLowerCase();
  
  // Fruits & Légumes
  if (name.includes('tomate') || name.includes('concombre') || name.includes('oignon') || 
      name.includes('carotte') || name.includes('courgette') || name.includes('aubergine') ||
      name.includes('poivron') || name.includes('épinard') || name.includes('salade') ||
      name.includes('brocoli') || name.includes('chou') || name.includes('pomme') ||
      name.includes('banane') || name.includes('citron') || name.includes('orange') ||
      name.includes('fraise') || name.includes('framboise') || name.includes('myrtille') ||
      name.includes('pomme de terre') || name.includes('patate') || name.includes('ail') ||
      name.includes('persil') || name.includes('basilic') || name.includes('coriandre') ||
      name.includes('menthe') || name.includes('thym') || name.includes('romarin') ||
      name.includes('céleri') || name.includes('radis') || name.includes('navet') ||
      name.includes('champignon') || name.includes('asperge') || name.includes('artichaut') ||
      name.includes('olive') || name.includes('avocat') || name.includes('kiwi') ||
      name.includes('pêche') || name.includes('abricot') || name.includes('prune') ||
      name.includes('cerise') || name.includes('pamplemousse') || name.includes('mandarine') ||
      name.includes('ananas') || name.includes('mangue') || name.includes('papaye') ||
      name.includes('coco') || name.includes('noix') || name.includes('amande') ||
      name.includes('noisette') || name.includes('pistache') || name.includes('raisin') ||
      name.includes('figue') || name.includes('datte') || name.includes('grenade')) {
    return 'Fruits & Légumes';
  }
  
  // Viandes & Poissons
  if (name.includes('poulet') || name.includes('bœuf') || name.includes('porc') ||
      name.includes('agneau') || name.includes('veau') || name.includes('dinde') ||
      name.includes('saumon') || name.includes('thon') || name.includes('cabillaud') ||
      name.includes('merlu') || name.includes('dorade') || name.includes('crevette') ||
      name.includes('moule') || name.includes('coquille') || name.includes('jambon') ||
      name.includes('bacon') || name.includes('saucisse') || name.includes('chorizo') ||
      name.includes('boudin') || name.includes('andouille') || name.includes('foie') ||
      name.includes('filet') || name.includes('côte') || name.includes('rôti') ||
      name.includes('escalope') || name.includes('côtelette') || name.includes('gigot') ||
      name.includes('épaule') || name.includes('poitrine') || name.includes('cuisse') ||
      name.includes('aile') || name.includes('poisson') || name.includes('sole') ||
      name.includes('turbot') || name.includes('bar') || name.includes('loup') ||
      name.includes('rouget') || name.includes('maquereau') || name.includes('sardine') ||
      name.includes('anchois') || name.includes('hareng') || name.includes('langouste') ||
      name.includes('homard') || name.includes('crabe') || name.includes('lobster') ||
      name.includes('calmar') || name.includes('poulpe') || name.includes('seiche') ||
      name.includes('huître') || name.includes('palourde') || name.includes('bigorneau')) {
    return 'Viandes & Poissons';
  }
  
  // Produits laitiers
  if (name.includes('lait') || name.includes('crème') || name.includes('beurre') ||
      name.includes('fromage') || name.includes('feta') || name.includes('mozzarella') ||
      name.includes('parmesan') || name.includes('cheddar') || name.includes('camembert') ||
      name.includes('brie') || name.includes('chèvre') || name.includes('yaourt') ||
      name.includes('yogourt') || name.includes('fromage blanc') || name.includes('ricotta') ||
      name.includes('mascarpone') || name.includes('gorgonzola') || name.includes('roquefort') ||
      name.includes('emmental') || name.includes('gruyère') || name.includes('comté') ||
      name.includes('reblochon') || name.includes('tomme') || name.includes('cantal') ||
      name.includes('fourme') || name.includes('bleu') || name.includes('stilton') ||
      name.includes('gouda') || name.includes('edam') || name.includes('munster') ||
      name.includes('maroilles') || name.includes('livarot') || name.includes('pont-l\'évêque') ||
      name.includes('coulommiers') || name.includes('neufchâtel') || name.includes('petit-suisse') ||
      name.includes('fromage frais') || name.includes('cottage') || name.includes('quark')) {
    return 'Produits laitiers';
  }
  
  // Boulangerie
  if (name.includes('pain') || name.includes('baguette') || name.includes('croissant') ||
      name.includes('brioche') || name.includes('pita') || name.includes('tortilla') ||
      name.includes('naan') || name.includes('chapati') || name.includes('focaccia') ||
      name.includes('ciabatta') || name.includes('sourdough') || name.includes('bagel') ||
      name.includes('muffin') || name.includes('biscuit') || name.includes('cracker') ||
      name.includes('biscotte') || name.includes('toast') || name.includes('sandwich') ||
      name.includes('pâte') || name.includes('pâtes') || name.includes('spaghetti') ||
      name.includes('macaroni') || name.includes('penne') || name.includes('fusilli') ||
      name.includes('rigatoni') || name.includes('lasagne') || name.includes('ravioli') ||
      name.includes('gnocchi') || name.includes('risotto') || name.includes('couscous') ||
      name.includes('quinoa') || name.includes('boulgour') || name.includes('semoule') ||
      name.includes('farine') || name.includes('levure') || name.includes('levain')) {
    return 'Boulangerie';
  }
  
  // Boissons
  if (name.includes('vin') || name.includes('bière') || name.includes('jus') ||
      name.includes('soda') || name.includes('coca') || name.includes('pepsi') ||
      name.includes('eau') || name.includes('thé') || name.includes('café') ||
      name.includes('champagne') || name.includes('whisky') || name.includes('vodka') ||
      name.includes('gin') || name.includes('rhum') || name.includes('cognac') ||
      name.includes('liqueur') || name.includes('sirop') || name.includes('smoothie') ||
      name.includes('milkshake') || name.includes('cocktail') || name.includes('sangria') ||
      name.includes('cidre') || name.includes('chouchen') || name.includes('calvados') ||
      name.includes('armagnac') || name.includes('marc') || name.includes('grappa') ||
      name.includes('porto') || name.includes('sherry') || name.includes('madère') ||
      name.includes('vermouth') || name.includes('martini') || name.includes('pastis') ||
      name.includes('ricard') || name.includes('pernod') || name.includes('absinthe') ||
      name.includes('limonade') || name.includes('orangina') || name.includes('schweppes') ||
      name.includes('tonic') || name.includes('ginger') || name.includes('sprite') ||
      name.includes('fanta') || name.includes('ice tea') || name.includes('infusion')) {
    return 'Boissons';
  }
  
  // Par défaut, Épicerie
  return 'Épicerie';
};
