import os


class FileCleanupService:
    def delete_file(self, path: str):

        if os.path.exists(path):
            os.remove(path)

            return True

        return False
