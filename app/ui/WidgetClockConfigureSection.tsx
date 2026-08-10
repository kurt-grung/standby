import { GroupedSection } from './GroupedSection';
import { WidgetConfigureTemplate } from './WidgetTemplateOutline';

export function WidgetClockConfigureSection() {
  return (
    <GroupedSection className="mb-0">
      <WidgetConfigureTemplate widget="clock" />
    </GroupedSection>
  );
}
