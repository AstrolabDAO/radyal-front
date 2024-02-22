import styled from "styled-components";
import tw from "twin.macro";
import { COLORS } from "~/styles/constants";
import PropTypes from "prop-types";

export const Input = tw.input`input input-bordered hover:border-primary w-full focus:outline-none bg-base/25 backdrop-blur-3xl placeholder:text-darkGrey`;

export const Button = styled.button<{
  primary?: boolean;
  outline?: boolean;
  big?: boolean;
}>`
  text-transform: uppercase;
  ${(props) =>
    !props.outline ? tw`btn h-10 min-h-0 rounded-xl border-none` : null}

  font-weight: 600;
  ${(props) => (props.big ? tw`h-12 text-lg` : "")}
  ${(props) => {
    if (props.outline) return;
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
      ? tw`p-2.5 border-solid border-darkerGrey border-2 rounded-xl bg-base text-white`
      : ""}
`;

Button.defaultProps = {
  big: false,
  primary: true,
  outline: false,
};
Button.propTypes = {
  big: PropTypes.bool,
  primary: PropTypes.bool,
  outline: PropTypes.bool,
};

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
  ${tw`bg-base p-6 rounded-2xl`}
`;
