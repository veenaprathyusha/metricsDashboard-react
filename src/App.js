import {useState, useEffect} from "react";
import './App.css';
import MetricTable from "./MetricTable";
import UpdateExpressionModal from './UpdateExpressionModal';
import carrierImage from "./Carrier.png";

function App() {
  const [data, setData] = useState([]);

  const columns = [
    { Header: 'Metric Name', accessor: 'metricname' },
    { Header: 'Expression', accessor: 'metricexpression' },
  ];

  const [selectedMetric, setSelectedMetric] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRowClick = metric => {
    setSelectedMetric(metric);
    setIsModalOpen(true);
  };

  const handleUpdateExpression = (metricId, newExpression) => {
    setData(prevData =>
      prevData.map(metric =>
        metric.id === metricId ? { ...metric, expression: newExpression } : metric
      )
    );
  };

  const closeModal = () => {
    setSelectedMetric(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/getMetricExpressions');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
       setData(result?.metricsDetails);
      } catch (error) {
        console.log("error fetching resposne")
      }
    };

    fetchData();
  }, []); 

  console.log("---53", data)
  return (
    <div className="App">
      <div>
        <img src= {carrierImage} className="logo_carrier" alt="carrier_image"/>
        <h2> Metrics Dashboard</h2>
      <MetricTable data={data || []} columns={columns} onRowClick={handleRowClick} />
      <UpdateExpressionModal
        isOpen={isModalOpen}
        onClose={closeModal}
        metric={selectedMetric}
        onUpdate={handleUpdateExpression}
        setData={setData}
        data={data}
      />
    </div>
    </div>
  );
}

export default App;
