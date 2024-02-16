import styled from "styled-components";
import tw from "twin.macro";
import { COLORS } from "~/styles/constants";

export const Input = tw.input`input input-bordered hover:border-primary w-full focus:outline-none bg-base/25 backdrop-blur-3xl`;

export const Button = styled.button<{
  primary?: boolean;
  outline?: boolean;
  big?: true;
}>`
  text-transform: uppercase;
  ${(props) =>
    !props.outline ? tw`btn h-10 min-h-0 rounded-xl border-none` : null}

  ${(props) => (props.big ? tw`h-14` : "")}
  ${(props) => {
    if (props.outline) return;
    if (props.primary === undefined) props.primary = true;
    if (props.disabled)
      return `
        background: ${COLORS["dark-grey"]}!important;
        color: ${COLORS.baseGrey}!important;
      `;
    return props.primary
      ? tw`btn-primary bg-primary-gradient`
      : tw`bg-secondary-gradient text-white`;
  }}
${(props) =>
    props.outline
      ? tw`p-2.5 border-solid border-darkerGrey border-1 rounded-xl bg-base text-white`
      : ""}
`;
export const StyledDropdown = styled.div<{ visible: boolean }>`
  outline: none;
  font-weight: 800;
  font-family: "Gilroy", sans-serif;
  ${(props) => (props.visible ? tw`flex` : tw`hidden`)};
  ${tw`absolute cursor-default right-0 mt-2 bg-dark
  rounded-2xl gap-3 p-4 flex-col w-40 font-semibold focus:outline-none`}
`;

export const ModalWrapper = styled.div`
  max-height: 90vh;
  ${tw`bg-base p-6 border-1 border-dark border-solid rounded-2xl`}
`;
