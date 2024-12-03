"""fix

Revision ID: 2ab0f1240cd7
Revises: 45a9038724d0
Create Date: 2024-12-03 12:45:02.036398

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '2ab0f1240cd7'
down_revision: Union[str, None] = '45a9038724d0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('results', 'test_name',
               existing_type=sa.BIGINT(),
               type_=sa.String(),
               existing_nullable=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('results', 'test_name',
               existing_type=sa.String(),
               type_=sa.BIGINT(),
               existing_nullable=False)
    # ### end Alembic commands ###
