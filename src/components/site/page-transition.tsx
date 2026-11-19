import { ViewTransition, type ComponentProps } from "react";

export function PageTransition(props: ComponentProps<"div">) {
  return <ViewTransition name="route-content" default="none" share="page-change" enter="page-change" exit="page-change">
    <div {...props} />
  </ViewTransition>;
}
