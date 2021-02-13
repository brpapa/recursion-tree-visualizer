import styled from 'styled-components'

export const Switch = styled.input.attrs({ type: 'checkbox' })`
  --active: ${({ theme }) => theme.colors.primary};
  --active-inner: #fff;
  --border: ${({ theme }) => theme.colors.borderAccent};
  --background: ${({ theme }) => theme.colors.foregroundAccent};
  
  appearance: none;
  height: 21px;
  width: 38px;
  border-radius: 11px;
  outline: none;
  display: inline-block;
  vertical-align: top;
  position: relative;
  margin: 0;
  margin-right: 0.2em;
  cursor: pointer;
  border: 1px solid var(--bc, var(--border));
  background: var(--b, var(--background));

  &:after {
    content: '';
    display: block;
    position: absolute;
    transition: transform var(--d-t, 0.3s) var(--d-t-e, ease),
      opacity var(--d-o, 0.2s);
    left: 2px;
    top: 2px;
    border-radius: 50%;
    width: 15px;
    height: 15px;
    background: var(--ab, var(--border));
    transform: translateX(var(--x, 0));
  }

  &:checked {
    --b: var(--active);
    --bc: var(--active);
    --d-o: 0.3s;
    --d-t: 0.6s;
    --d-t-e: cubic-bezier(0.2, 0.85, 0.32, 1.2);
    --ab: var(--active-inner);
    --x: 17px;
  }
`
