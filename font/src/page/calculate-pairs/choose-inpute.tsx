interface ChooseInputProps<Values extends string[] = string[]> {
  options: Values;
  values: Values;
  onChange: (values: Values) => void;
}
export const ChooseInput = (props: ChooseInputProps) => {
  let isOpen = false;
  const { onChange } = props;
  const onOpen = () => {
    isOpen = true;
  };
  const onClose = () => {
    isOpen = false;
  };
  return (
    <div
      class={`dropdown ${isOpen ? "is-active" : ""}`}
      tabindex="0"
      onFocusin={onOpen}
      onFocusout={onClose}
    >
      <div class="dropdown-trigger">
        <button
          class="button"
          aria-haspopup="true"
          aria-controls="dropdown-menu"
        >
          <span>
            {props.values.length ? props.values.join(", ") : "Currency"}
          </span>
          <span class="icon is-small">
            <i class="fas fa-angle-down" aria-hidden="true"></i>
          </span>
        </button>
      </div>
      <div class="dropdown-menu" id="dropdown-menu" role="menu">
        <div class="dropdown-content">
          {props.options.map((el) => {
            return (
              <a
                class={`dropdown-item pointer ${
                  props.values.includes(el) ? "is-active" : ""
                }`}
                onClick={() => {
                  if (props.values.includes(el)) {
                    onChange(props.values.filter((val) => val !== el));
                  } else {
                    onChange([...props.values, el]);
                  }
                }}
              >
                {el}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};
