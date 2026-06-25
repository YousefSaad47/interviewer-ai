"""
Custom exceptions for the application.
"""


class ResumeNotFound(Exception):
    pass


class FileNotFound(Exception):
    pass


class InvalidFile(Exception):
    pass


class JobNotFound(Exception):
    pass


class AuthenticationError(Exception):
    pass


class AuthorizationError(Exception):
    pass


class ValidationError(Exception):
    pass


class StorageError(Exception):
    pass


class EncryptionError(Exception):
    pass
