import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// One react component for the entire table (Records)
// Another react component for each row of the result set (Record)
// this is for the link to move to edit each by record_id 
// <td><Link to={`/edit/${props.record._id}`}>Edit</Link></td>
// was inside <tr> below after all records

const Record = (props) => (
    <tr>
        <td>{props.record.savings}</td>
        <td>{props.record.checking}</td>
    </tr>
);

export default function Records() {
    const [records, setRecords] = useState([]);

    useEffect(() => {
        async function getRecords() {
            const response = await fetch(`http://localhost:5000/record/:email`);
            if (!response.ok) {
                const message = `An error ocurred: ${response.statusText}`
                window.alert(message);
                return;
            }
            const responseRecords = await response.json();
            setRecords(responseRecords);
            return;
        }
        getRecords();
        return;
    },[records.length]);
    
    function recordList() {
        return records.map((record) => {
            return (
                <Record
                    record={record}
                    key={record._id}
                />
            );
        });
    };
    return (
        <div>
            <h3>Account Summary</h3>
            <table style={{marginTop: 20}}>
                <thead>
                    <tr>
                        <th>Savings</th>
                        <th>Checking</th>
                    </tr>
                </thead>
                <tbody>{recordList()}</tbody>
            </table>
        </div>
    );
}