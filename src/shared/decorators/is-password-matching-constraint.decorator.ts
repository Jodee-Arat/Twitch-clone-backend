import { NewPasswordInput } from "@/src/modules/auth/password-recovery/inputs/new-password.input";
import {
  ValidationArguments,
  ValidatorConstraint,
  type ValidatorConstraintInterface,
} from "class-validator";

@ValidatorConstraint({ name: "IsPasswordMatching", async: false })
export class IsPasswordMatchingConstraint
  implements ValidatorConstraintInterface
{
  validate(passwordRepeat: string, args: ValidationArguments) {
    const object = args.object as NewPasswordInput;

    return object.password === passwordRepeat;
  }

  defaultMessage(validationArguments?: ValidationArguments) {
    return "Пароли не совпадают";
  }
}
