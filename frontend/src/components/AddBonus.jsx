import React, { useState } from 'react';
import styles from '../styles/Feedback.module.css';
import axios from 'axios';

const AddBonus = ({ show, onClose, userId }) => {

    const [formData, setFormData] = useState({
        cuantum_bonus: 0,
        descriere_bonus: "",
        aplicat: false,
        idUser: userId,
    });

    if (!show) {
        return null;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/bonus/add', formData);
            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    const handleRadioChange = (e) => {
        const { value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            aplicat: value === "true"
        }));
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <button className={styles.closeButton} onClick={onClose}>
                    &times;
                </button>
                <div className={styles.modalContent}>
                    <form onSubmit={handleSubmit}>

                        <div>
                            <label htmlFor="cuantum_bonus">Cuantum bonus:</label>
                            <input
                                type="number"
                                id="cuantum_bonus"
                                name="cuantum_bonus"
                                value={formData.cuantum_bonus}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="descriere_bonus">Descriere bonus:</label>
                            <textarea
                                id="descriere_bonus"
                                name="descriere_bonus"
                                value={formData.descriere_bonus}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label>Aplicat:</label>
                            <div>
                                <input
                                    type="radio"
                                    id="aplicat_true"
                                    name="aplicat"
                                    value="true"
                                    checked={formData.aplicat === true}
                                    onChange={handleRadioChange}
                                />
                                <label htmlFor="aplicat_true">Da</label>
                            </div>
                            <div>
                                <input
                                    type="radio"
                                    id="aplicat_false"
                                    name="aplicat"
                                    value="false"
                                    checked={formData.aplicat === false}
                                    onChange={handleRadioChange}
                                />
                                <label htmlFor="aplicat_false">Nu</label>
                            </div>
                        </div>

                        <button type="submit">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddBonus;
