
const MemoryItem = ({ card }) => {

    const SetCardColor = () => {
        if (card.isSelected) return card.color;
        if (!card.isSelected && !card.isPaired) return 'white';
        if (card.isPaired) return 'purple';
    }

    return (
        <div className={`memory-card w-full h-full text-center bg-${SetCardColor()}-500 rounded border-2 border-red-400 ${card.isPaired && ('opacity-0')}`}>
            <p className="text-white font-bold">{card.color}</p>
        </div>
    )
}

export default MemoryItem;