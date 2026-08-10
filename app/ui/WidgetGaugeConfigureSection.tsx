import { GroupedSection } from './GroupedSection';
import { WidgetConfigureTemplate } from './WidgetTemplateOutline';

export function WidgetGaugeConfigureSection() {
  return (
    <GroupedSection className="mb-0">
      <WidgetConfigureTemplate widget="gauge" />
    </GroupedSection>
  );
}
