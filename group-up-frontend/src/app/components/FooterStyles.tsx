import styled from "styled-components";
export const FooterWrapper = styled.div`
  height: 100%;
  grid-row-start: footer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  padding-top: 20px;
  padding-bottom: 20px;
  box-shadow: -5px 2px 1px 5px rgba(0, 0, 0, 0.15);
  & > div {
    text-align: center;
  }
`;
export const Credit = styled.div`
  font-weight: normal;
  margin: 4px 0;
  font-size: 12px;
  color: #888;
  a {
    color: inherit;
  }
`;
export const Spacer = styled.span`
  margin: 0 7.5px;
  ::after {
    content: "•";
  }
`;
