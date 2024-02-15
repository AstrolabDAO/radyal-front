import styled from "styled-components";
import tw from "twin.macro";

export const Input = tw.input`input input-bordered hover:border-primary w-full focus:outline-none bg-dark-800/25 backdrop-blur-3xl`;

export const Button = styled.button<{ primary?: boolean; outline?: boolean }>`
  ${(props) =>
    !props.outline ? tw`btn h-10 min-h-0 rounded-xl border-none` : null}

  ${(props) => {
    if (props.outline) return;
    if (props.primary === undefined) props.primary = true;
    if (props.disabled) return tw`btn-disabled bg-base-gradient`;
    return props.primary
      ? tw`btn-primary bg-primary-gradient`
      : tw`bg-secondary-gradient text-white`;
  }}
${(props) =>
    props.outline
      ? tw`p-2.5 border-solid border-dark-600 border-1 rounded-xl bg-base text-white`
      : ""}
`;
export const StyledDropdown = styled.div<{ visible: boolean }>`
  outline: none;
  font-family: "Gilroy", sans-serif;
  ${(props) => (props.visible ? tw`flex` : tw`hidden`)};
  ${tw`absolute text-white cursor-default right-0 mt-2 bg-dark-800
  gap-3 p-4 flex-col w-40 font-semibold focus:outline-none`}
`;

export const ModalWrapper = styled.div`
  max-height: 90vh;
  ${tw`bg-dark-800 p-6 border-1 border-dark-700 border-solid rounded-2xl`}
`;
