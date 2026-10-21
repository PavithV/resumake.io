import { useFormContext, Controller } from 'react-hook-form'
import styled from 'styled-components'

import { FormSection } from './FormSection'
import { TEMPLATES } from '../../../../lib/templates/constants'
import { colors } from '../../../../theme'

import { FormValues } from '../../../../types'

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`

const Card = styled.label<{ $active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: ${(props) => (props.$active ? colors.primary : 'silver')};

  img {
    width: 100%;
    border-radius: 3px;
    opacity: ${(props) => (props.$active ? 1 : 0.65)};
    box-shadow: ${(props) =>
      props.$active ? `0 0 0 2px ${colors.primary}` : 'none'};
    transition: all 0.3s ease-out;
  }

  &:hover img {
    opacity: 1;
    transform: translateY(-3px);
  }

  &:focus-within img {
    outline: 2px solid ${colors.primary};
    outline-offset: 2px;
  }

  input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }
`

export function TemplatesSection() {
  const { control } = useFormContext<FormValues>()

  return (
    <FormSection title="Choose a Template">
      <Controller
        control={control}
        name="selectedTemplate"
        render={({ field }) => (
          <Grid>
            {TEMPLATES.map((templateId) => (
              <Card key={templateId} $active={field.value === templateId}>
                <input
                  type="radio"
                  name={field.name}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  value={templateId}
                  checked={field.value === templateId}
                />
                <img
                  src={`/templates/previews/${templateId}.png`}
                  alt={`Template ${templateId}`}
                  loading="lazy"
                />
                Template {templateId}
              </Card>
            ))}
          </Grid>
        )}
      />
    </FormSection>
  )
}
