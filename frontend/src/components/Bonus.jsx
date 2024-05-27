const Bonus = ({user, bonus}) => {
    return (
        <div>
            <p>Cuantum: {bonus.cuantum_bonus}</p>
            <p>Descriere: {bonus.descriere_bonus}</p>
            <p>A fost aplicat deja: {bonus.aplicat ? "DA" : "NU"}</p>
        </div>
    )
}

export default Bonus;