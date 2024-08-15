function Logout() {
    const handleLogout = async () => {
        try {
            const sessionResponse = await fetch(`http://localhost:4000/session_delete`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include"
            });
            if (sessionResponse.ok) {
                window.alert("Successfully Logged Out");
                window.location.href = 'http://localhost:3000/';
            }
        } catch (err) {
            console.error('Error');
        }
    };
    handleLogout();

    return (
        <div></div>
    );
};

export default Logout;
