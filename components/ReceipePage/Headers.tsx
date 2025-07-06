const Header = () => {
    return (
        <header className='max-w-[1400px] mx-auto p-8 text-center max-sm:pl-4 max-sm:pr-4'>
            <h1 className='text-[2.5rem] text-[#3b82f6] mb-4 max-md:text-[2rem] font-bold'>
                🍳 Decouvrez nos recettes
            </h1>

            <p className='text-lg text-[#b0b0b0] max-w-[600px] mx-auto'>
                Plus de 1000 recettes créées par notre IA et validées par nos chefs. Trouvez l inspiration pour vos prochains repas.
            </p>
        </header>
    )
}

export default Header;