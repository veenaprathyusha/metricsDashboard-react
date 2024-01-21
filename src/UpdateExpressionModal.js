import React, { useState } from 'react';

const UpdateExpressionModal = ({ isOpen, onClose, metric, onUpdate, setData, data }) => {

  const [expression, setExpression] = useState(metric?.metricexpression);
  const [error, setError] = useState("");
  const availableParameters =[ "avg_ch_ecw", "avg_ch_lcw", "(1 + abs( avg_ch_lcw - avg_ch_design_controlPoint ) / avg_ch_design_controlPoint)*100", "(1 - abs( avg_ch_lcw - avg_ch_design_controlPoint ) / avg_ch_design_controlPoint)*100"]

  const handleUpdate = async() => {
    if(availableParameters.includes(expression)){
        onUpdate(metric.id, expression);
       const requestOptions = {    method: 'PUT',    headers: { 'Content-Type': 'application/json' },    
       body: JSON.stringify({ metricexpression: expression })};
       await fetch(`http://localhost:3001/updateMetricExpression/${metric?.id}`, requestOptions)    
       .then(response => 
         response.json()).then((updatedMetric) => {
            let detail = updatedMetric?.metricsDetails;
            let updated_data = data.map((obj) => {
                if (obj.id === detail.id) return detail
                else return obj
              })
         setData(updated_data);
        })  
        onClose();
    } else{
           if(expression === ""){
               setError("please enter some value");
           } else{
        setError("please add a correct expression with correct paramters");
           }
    }
  };

  return (
    isOpen && (
      <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={onClose}>
            &times;
          </span>
          <h2>Update Expression</h2>
          <h2>Metric name : {metric?.metricname}</h2>
          <label>
            Expression:
            <input
              type="text"
              value={expression}
              required
              onChange={e => setExpression(e.target.value)}
            />
            {error && <p className='inline-error'>{error}</p>}
          </label>
          <button onClick={handleUpdate}>Update</button>
        </div>
      </div>
    )
  );
};

export default UpdateExpressionModal;
