"use client"

export interface TagProps {
  name?: string,
  color?: string,
  action?: () => void,
  isDisabled?: boolean
}

const Tag = ({
  name,
  color,
  action,
  isDisabled = false
}: TagProps) => {

  return (<>
    <button
      type="button"
      onClick={action}
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