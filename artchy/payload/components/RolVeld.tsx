"use client";

import { SelectField, useAuth } from "@payloadcms/ui";
import type { Option } from "payload";
import React from "react";

/**
 * Het rolkeuzeveld. Voor een eigenaar staan alle rollen in de lijst;
 * voor iedereen anders bestaat de rol "eigenaar" niet — die zien alleen
 * Beheerder en Redacteur, en Beheerder is voor hen de hoogste rol.
 *
 * Dit is puur de weergave. De echte grens ligt in de access-regels en de
 * beforeChange-hook van de gebruikerscollectie: ook wie de API direct
 * aanroept kan de eigenaarsrol niet toekennen.
 */
type Props = React.ComponentProps<typeof SelectField>;

export const RolVeld: React.FC<Props> = (props) => {
  const { user } = useAuth();
  const isEigenaar = (user as { rol?: string } | null)?.rol === "eigenaar";

  const opties = (props.field?.options ?? []) as Option[];
  const zichtbaar = isEigenaar
    ? opties
    : opties.filter(
        (optie) =>
          (typeof optie === "string" ? optie : optie.value) !== "eigenaar",
      );

  return <SelectField {...props} field={{ ...props.field, options: zichtbaar }} />;
};

export default RolVeld;
