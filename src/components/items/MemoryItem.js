
const MemoryItem = ({ value }) => {

    const SetCardColor = () => {
        if (value.isSelected) return 'green';
        if (!value.isSelected && !value.isPaired) return 'gray';
        if (value.isPaired) return 'purple';
    }

    return (
        <div className={`memory-card w-full h-full text-center bg-${SetCardColor()}-500 rounded`}>
            <p className="text-white font-bold">{value.color}</p>
        </div>
    )
}

export default MemoryItem;