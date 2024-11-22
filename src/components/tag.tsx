"use client"

interface TagProps {
  key?: string,
  name?: string,
  color?: 'primary' | 'important' | 'life' | 'family' | 'work',
  action?: () => void,
  isDisabled?: boolean
}

const Tag = ({
  key,
  name,
  color,
  action,
  isDisabled = false
}: TagProps) => {

  return (<>
    <button
      onClick={action}
      key={key}
      className={`
        w-fit px-3 rounded-xl text-1xs font-publicSans
        ${isDisabled ? 'text-disableText' : 'text-darkText'}
      `}
      style={{ backgroundColor: !color || isDisabled ? 'var(--disable)' : `var(--${color})`}}
    >
      {name}
    </button>
  </>);
};

export default Tag;