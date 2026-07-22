import { describe, expect, it, vi } from 'vitest'
import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { UserEvent } from '@testing-library/user-event'
import { ContactForm } from './ContactForm'
import type { ContactFormValues } from './contactSchema'

const VALID_INPUT: ContactFormValues = {
  name: 'Ana Pérez',
  email: 'ana@example.com',
  message: 'Hola, me gustaría hablar sobre un proyecto.',
}

/** Renders the form with a stubbed request and returns the handles tests need. */
function setup(onSubmit: (values: ContactFormValues) => Promise<void> = vi.fn().mockResolvedValue(undefined)) {
  const user = userEvent.setup()
  render(<ContactForm onSubmit={onSubmit} />)
  return { user, onSubmit }
}

const getName = () => screen.getByLabelText('Nombre')
const getEmail = () => screen.getByLabelText('Email')
const getMessage = () => screen.getByLabelText('Mensaje')
/** The label flips to "Enviando…" mid-request, so both names must match. */
const getSubmit = () => screen.getByRole('button', { name: /enviar mensaje|enviando/i })

async function fillValidForm(user: UserEvent, values: ContactFormValues = VALID_INPUT) {
  await user.type(getName(), values.name)
  await user.type(getEmail(), values.email)
  await user.type(getMessage(), values.message)
}

describe('ContactForm', () => {
  describe('accessibility', () => {
    it('exposes every field through its visible label', () => {
      setup()

      expect(getName()).toBeInTheDocument()
      expect(getEmail()).toBeInTheDocument()
      expect(getMessage()).toBeInTheDocument()
      expect(getSubmit()).toBeEnabled()
    })

    it('can be filled and submitted using only the keyboard', async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined)
      const { user } = setup(onSubmit)

      await user.tab()
      expect(getName()).toHaveFocus()
      await user.keyboard(VALID_INPUT.name)

      await user.tab()
      expect(getEmail()).toHaveFocus()
      await user.keyboard(VALID_INPUT.email)

      await user.tab()
      expect(getMessage()).toHaveFocus()
      await user.keyboard(VALID_INPUT.message)

      await user.tab()
      expect(getSubmit()).toHaveFocus()
      await user.keyboard('{Enter}')

      await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1))
    })

    it('links each invalid field to its error message', async () => {
      const { user } = setup()

      await user.click(getSubmit())

      const nameError = await screen.findByText('El nombre debe tener al menos 2 caracteres.')
      const nameInput = getName()

      expect(nameInput).toHaveAttribute('aria-invalid', 'true')
      expect(nameInput.getAttribute('aria-describedby')).toContain(nameError.id)
      expect(nameInput).toHaveAccessibleDescription(
        'El nombre debe tener al menos 2 caracteres.',
      )
    })

    it('keeps the hint associated with the message field', () => {
      setup()

      expect(getMessage()).toHaveAccessibleDescription(
        'Contanos en qué podemos ayudarte (mínimo 10 caracteres).',
      )
    })
  })

  describe('validation', () => {
    it('blocks submission and shows an error per empty field', async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined)
      const { user } = setup(onSubmit)

      await user.click(getSubmit())

      expect(
        await screen.findByText('El nombre debe tener al menos 2 caracteres.'),
      ).toBeInTheDocument()
      expect(screen.getByText('Ingresá tu email.')).toBeInTheDocument()
      expect(screen.getByText('El mensaje debe tener al menos 10 caracteres.')).toBeInTheDocument()
      expect(onSubmit).not.toHaveBeenCalled()
    })

    it('rejects a malformed email', async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined)
      const { user } = setup(onSubmit)

      await fillValidForm(user, { ...VALID_INPUT, email: 'ana@@example' })
      await user.click(getSubmit())

      expect(await screen.findByText(/ingresá un email válido/i)).toBeInTheDocument()
      expect(onSubmit).not.toHaveBeenCalled()
    })

    it('rejects a message made only of whitespace', async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined)
      const { user } = setup(onSubmit)

      await fillValidForm(user, { ...VALID_INPUT, message: '          ' })
      await user.click(getSubmit())

      expect(
        await screen.findByText('El mensaje debe tener al menos 10 caracteres.'),
      ).toBeInTheDocument()
      expect(onSubmit).not.toHaveBeenCalled()
    })

    it('clears the error once the field is corrected', async () => {
      const { user } = setup()

      await user.click(getSubmit())
      expect(
        await screen.findByText('El nombre debe tener al menos 2 caracteres.'),
      ).toBeInTheDocument()

      await user.type(getName(), VALID_INPUT.name)

      await waitFor(() => {
        expect(
          screen.queryByText('El nombre debe tener al menos 2 caracteres.'),
        ).not.toBeInTheDocument()
      })
    })

    it('submits trimmed values', async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined)
      const { user } = setup(onSubmit)

      await fillValidForm(user, {
        name: '  Ana Pérez  ',
        email: '  ana@example.com  ',
        message: '  Hola, me gustaría hablar sobre un proyecto.  ',
      })
      await user.click(getSubmit())

      await waitFor(() => expect(onSubmit).toHaveBeenCalledWith(VALID_INPUT))
    })
  })

  describe('submission', () => {
    it('disables the button while the request is in flight and re-enables it after', async () => {
      let resolveRequest: () => void = () => {}
      const onSubmit = vi.fn(
        () =>
          new Promise<void>((resolve) => {
            resolveRequest = resolve
          }),
      )
      const { user } = setup(onSubmit)

      await fillValidForm(user)
      await user.click(getSubmit())

      await waitFor(() => expect(getSubmit()).toBeDisabled())
      expect(getSubmit()).toHaveAttribute('aria-busy', 'true')
      expect(screen.getByRole('button', { name: /enviando/i })).toBeInTheDocument()

      await act(async () => {
        resolveRequest()
      })

      await waitFor(() => expect(getSubmit()).toBeEnabled())
      expect(getSubmit()).not.toHaveAttribute('aria-busy')
    })

    it('ignores repeated clicks while submitting', async () => {
      let resolveRequest: () => void = () => {}
      const onSubmit = vi.fn(
        () =>
          new Promise<void>((resolve) => {
            resolveRequest = resolve
          }),
      )
      const { user } = setup(onSubmit)

      await fillValidForm(user)
      await user.click(getSubmit())
      await waitFor(() => expect(getSubmit()).toBeDisabled())

      // A disabled button fires no click event, which is exactly the guarantee
      // being asserted: the request cannot be sent twice.
      await user.click(getSubmit())

      await act(async () => {
        resolveRequest()
      })

      expect(onSubmit).toHaveBeenCalledTimes(1)
    })

    it('shows a success message and clears the form', async () => {
      const { user } = setup()

      await fillValidForm(user)
      await user.click(getSubmit())

      const success = await screen.findByRole('status')
      expect(success).toHaveTextContent(/tu mensaje fue enviado/i)

      expect(getName()).toHaveValue('')
      expect(getEmail()).toHaveValue('')
      expect(getMessage()).toHaveValue('')
    })

    it('moves focus to the result message so it is announced', async () => {
      const { user } = setup()

      await fillValidForm(user)
      await user.click(getSubmit())

      const success = await screen.findByRole('status')
      await waitFor(() => expect(success).toHaveFocus())
    })

    it('lets the user send a second message after a success', async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined)
      const { user } = setup(onSubmit)

      await fillValidForm(user)
      await user.click(getSubmit())
      await screen.findByRole('status')

      const secondMessage = { ...VALID_INPUT, message: 'Segundo mensaje de prueba, gracias.' }
      await fillValidForm(user, secondMessage)
      await user.click(getSubmit())

      await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(2))
      expect(onSubmit).toHaveBeenLastCalledWith(secondMessage)
    })

    it('shows the failure message and keeps the typed values', async () => {
      const onSubmit = vi.fn().mockRejectedValue(new Error('El servidor no responde.'))
      const { user } = setup(onSubmit)

      await fillValidForm(user)
      await user.click(getSubmit())

      const alert = await screen.findByRole('alert')
      expect(alert).toHaveTextContent('El servidor no responde.')

      expect(getName()).toHaveValue(VALID_INPUT.name)
      expect(getEmail()).toHaveValue(VALID_INPUT.email)
      expect(getMessage()).toHaveValue(VALID_INPUT.message)
      expect(getSubmit()).toBeEnabled()
    })

    it('falls back to a generic message when the failure has no message', async () => {
      const onSubmit = vi.fn().mockRejectedValue('boom')
      const { user } = setup(onSubmit)

      await fillValidForm(user)
      await user.click(getSubmit())

      expect(await screen.findByRole('alert')).toHaveTextContent(/no pudimos enviar tu mensaje/i)
    })

    it('replaces the previous failure message on a successful retry', async () => {
      const onSubmit = vi
        .fn()
        .mockRejectedValueOnce(new Error('El servidor no responde.'))
        .mockResolvedValueOnce(undefined)
      const { user } = setup(onSubmit)

      await fillValidForm(user)
      await user.click(getSubmit())
      await screen.findByRole('alert')

      await user.click(getSubmit())

      expect(await screen.findByRole('status')).toBeInTheDocument()
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })
  })
})
