import Choices from '../Choices';

const Math = ({ socket, question }) => {

    return (
        <div>
            <h1>MATH</h1>

            <p className='text-2xl md:text-4xl my-2'>{question.choices !== undefined && question.message}</p>

            <div className='grid grid-cols-2 md:grid-cols-6 '>
                <Choices socket={socket} />
            </div>

        </div>
    )
}

export default Math;