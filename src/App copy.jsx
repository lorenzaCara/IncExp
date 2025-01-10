import { useState, useEffect } from 'react';
import AddNewModal from './AddNewModal';
import ExpensesCard from './ExpensesCard';
import IncomesCard from './IncomesCard';
import { Button } from './components/ui/button';
import DataPicker from './DatePickerDemo';

const SetUp = () => {
  const [entrate, setEntrate] = useState([]);
  const [uscite, setUscite] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [selectedDate, setSelectedDate] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const fetchData = () => {
    setLoading(true);

    Promise.all([
      fetch('http://localhost:3001/entrate').then((res) => res.json()),
      fetch('http://localhost:3001/uscite').then((res) => res.json()),
    ])
      .then(([entrateData, usciteData]) => {
        const filteredEntrate = entrateData.filter((item) => {
          const itemDate = new Date(item.data);
          return (
            itemDate.getMonth() + 1 === selectedDate.month &&
            itemDate.getFullYear() === selectedDate.year
          );
        });

        const filteredUscite = usciteData.filter((item) => {
          const itemDate = new Date(item.data);
          return (
            itemDate.getMonth() + 1 === selectedDate.month &&
            itemDate.getFullYear() === selectedDate.year
          );
        });

        setEntrate(filteredEntrate);
        setUscite(filteredUscite);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const handleEdit = (item, type) => {
    setCurrentItem({ ...item, type });
    setIsModalOpen(true);
  };

  const handleDelete = (id, type) => {
    fetch(`http://localhost:3001/${type}/${id}`, { method: 'DELETE' }) //uso template literal al posto della concatenazione (ovvero => 'http://localhost:3001/' + type + '/' + id ), perchè? Per provare
      .then(() => fetchData())
      .catch((error) => console.error('Error deleting item:', error));
  };

  const handleSave = (item) => {
    if (!item.titolo || !item.data || !item.ammontare || !item.type) {
      alert('Tutti i campi sono obbligatori.');
      return;
    }

    const saveItem = (method, url, body) =>
      fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

    if (currentItem && currentItem.id) {
      if (currentItem.type !== item.type) {
        saveItem('DELETE', `http://localhost:3001/${currentItem.type}/${currentItem.id}`)
          .then(() => saveItem('POST', `http://localhost:3001/${item.type}`, item))
          .then(() => fetchData())
          .catch((error) => console.error('Error updating item:', error));
      } else {
        saveItem('PUT', `http://localhost:3001/${item.type}/${currentItem.id}`, item)
          .then(() => fetchData())
          .catch((error) => console.error('Error saving item:', error));
      }
    } else {
      saveItem('POST', `http://localhost:3001/${item.type}`, item)
        .then(() => fetchData())
        .catch((error) => console.error('Error saving item:', error));
    }
    setIsModalOpen(false);
    setCurrentItem(null);
  };

  const handleAddNew = () => {
    setCurrentItem({ type: 'entrate', titolo: '', data: '', ammontare: '' });
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-md mb-6 border border-gray-200">
        <p className="text-2xl font-bold mb-4 sm:mb-0">Budgy</p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <DataPicker 
            selectedDate={selectedDate} 
            handleDateChange={handleDateChange} 
          />
          <Button 
            onClick={handleAddNew} 
            className="px-6 rounded-md w-full sm:w-auto"
          >
            + Add new
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mb-6">
          <IncomesCard 
            entrate={entrate} 
            loading={loading} 
            handleEdit={handleEdit} 
            handleDelete={handleDelete} 
          />
        </div>
        <div>
          <ExpensesCard 
            uscite={uscite} 
            loading={loading} 
            handleEdit={handleEdit} 
            handleDelete={handleDelete} 
          />
        </div>
      </div>
        <AddNewModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          item={currentItem} 
          onSave={handleSave} 
        />
    </div>
  );
};

export default SetUp;

