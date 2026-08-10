import { WidgetConfigurePanel } from './components/WidgetConfigurePanel';
import { useWidgetConfig } from './hooks/useWidgetConfig';
import './App.css';

export default function App() {
  const config = useWidgetConfig();

  return (
    <main className="app">
      <WidgetConfigurePanel config={config} />
    </main>
  );
}
