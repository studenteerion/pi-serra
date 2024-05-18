import './Button.css';

const Button = ({title, value, progress, color}) => {

    function handleTestAccendi() {

        const myHeaders = new Headers();
        myHeaders.append("x-api-key", "9mns924xqak1nkqmkjnpas01742bsino");
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "status": "0"
        });

        const requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch("http://localhost:8080/controls/a1736624-0f33-4c20-a04e-e8a6a059d2c4", requestOptions)
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.error(error));
    }


    return (
        <div className="Actuators-container">
            <button onClick={handleTestAccendi}>On/Off</button>
        </div>
    );
};

export default Button;