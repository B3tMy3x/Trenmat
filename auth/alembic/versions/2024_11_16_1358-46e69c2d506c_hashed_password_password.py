"""hashed_password -> password

Revision ID: 46e69c2d506c
Revises: cb71a099c242
Create Date: 2024-11-16 13:58:17.465603

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '46e69c2d506c'
down_revision: Union[str, None] = 'cb71a099c242'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('students', sa.Column('password', sa.String(), nullable=False))
    op.drop_column('students', 'hashed_password')
    op.add_column('teachers', sa.Column('password', sa.String(), nullable=False))
    op.drop_column('teachers', 'hashed_password')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('teachers', sa.Column('hashed_password', sa.VARCHAR(), autoincrement=False, nullable=False))
    op.drop_column('teachers', 'password')
    op.add_column('students', sa.Column('hashed_password', sa.VARCHAR(), autoincrement=False, nullable=False))
    op.drop_column('students', 'password')
    # ### end Alembic commands ###
